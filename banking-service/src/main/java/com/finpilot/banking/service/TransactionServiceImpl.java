package com.finpilot.banking.service;

import com.finpilot.banking.dto.PredictionRequest;
import com.finpilot.banking.dto.PredictionResponse;
import com.finpilot.banking.dto.TransactionResponse;
import com.finpilot.banking.entity.Account;
import com.finpilot.banking.entity.Transaction;
import com.finpilot.banking.entity.TransactionStatus;
import com.finpilot.banking.entity.TransactionType;
import com.finpilot.banking.entity.User;
import com.finpilot.banking.exception.BadRequestException;
import com.finpilot.banking.exception.ForbiddenException;
import com.finpilot.banking.exception.InsufficientBalanceException;
import com.finpilot.banking.exception.ResourceNotFoundException;
import com.finpilot.banking.exception.TransactionBlockedException;
import com.finpilot.banking.repository.AccountRepository;
import com.finpilot.banking.repository.TransactionRepository;
import com.finpilot.banking.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AIService aiService;

    @Autowired
    private BankingPinService bankingPinService;


    // -------------------------------------------------------
    // Deposit
    // -------------------------------------------------------

    @Override
    @Transactional
    public TransactionResponse deposit(
            Long accountId,
            BigDecimal amount,
            String description,
            String bankingPin,
            String userEmail) {

        validateAmount(amount);

        User user = getUser(userEmail);

        bankingPinService.verifyPin(userEmail, bankingPin);

        Account account = accountRepository
                .findByIdForUpdate(accountId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Account not found"));

        verifyOwnership(account, user);

        account.setBalance(
                account.getBalance().add(amount)
        );

        accountRepository.save(account);

        Transaction transaction = new Transaction();

        transaction.setAccount(account);
        transaction.setAmount(amount);
        transaction.setTransactionType(TransactionType.DEPOSIT);
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setDescription(
                normalizeDescription(description, "Cash Deposit")
        );
        transaction.setReferenceNumber(
                UUID.randomUUID().toString()
        );

        transactionRepository.save(transaction);

        return map(transaction);
    }


    // -------------------------------------------------------
    // Withdraw
    // -------------------------------------------------------

    @Override
    @Transactional
    public TransactionResponse withdraw(
            Long accountId,
            BigDecimal amount,
            String description,
            String bankingPin,
            String userEmail) {

        validateAmount(amount);

        User user = getUser(userEmail);

        bankingPinService.verifyPin(userEmail, bankingPin);

        Account account = accountRepository
                .findByIdForUpdate(accountId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Account not found"));

        verifyOwnership(account, user);

        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance");
        }

        account.setBalance(
                account.getBalance().subtract(amount)
        );

        accountRepository.save(account);

        Transaction transaction = new Transaction();

        transaction.setAccount(account);
        transaction.setAmount(amount);
        transaction.setTransactionType(TransactionType.WITHDRAW);
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setDescription(
                normalizeDescription(description, "Cash Withdrawal")
        );
        transaction.setReferenceNumber(
                UUID.randomUUID().toString()
        );

        transactionRepository.save(transaction);

        return map(transaction);
    }


    // -------------------------------------------------------
    // Transfer
    // -------------------------------------------------------

    @Override
    @Transactional(rollbackFor = Exception.class)
    public TransactionResponse transfer(
            String toAccountNumber,
            BigDecimal amount,
            String description,
            String bankingPin,
            String userEmail) {

        validateAmount(amount);

        if (toAccountNumber == null || toAccountNumber.isBlank()) {
            throw new BadRequestException("Receiver account number is required");
        }

        User user = getUser(userEmail);

        bankingPinService.verifyPin(userEmail, bankingPin);

        // -------------------------------------------------------
        // SECURITY:
        // Sender is ALWAYS the authenticated user's account.
        // The frontend cannot choose the sender account.
        // -------------------------------------------------------

        Account sender = accountRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Sender account not found")
                );

        Account receiver = accountRepository
                .findByAccountNumber(toAccountNumber.trim())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Receiver account not found")
                );

        if (sender.getId().equals(receiver.getId())) {
            throw new BadRequestException(
                    "Cannot transfer to same account"
            );
        }

        // -------------------------------------------------------
        // Lock accounts in ID order.
        // Prevents opposite-direction transfers from deadlocking.
        // -------------------------------------------------------

        Long firstId = Math.min(sender.getId(), receiver.getId());
        Long secondId = Math.max(sender.getId(), receiver.getId());

        Account firstLocked = accountRepository
                .findByIdForUpdate(firstId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Account not found")
                );

        Account secondLocked = accountRepository
                .findByIdForUpdate(secondId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Account not found")
                );

        if (sender.getId().equals(firstId)) {
            sender = firstLocked;
            receiver = secondLocked;
        } else {
            sender = secondLocked;
            receiver = firstLocked;
        }

        // Final ownership verification after locking.
        verifyOwnership(sender, user);

        if (sender.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException(
                    "Insufficient balance"
            );
        }

        // =====================================================
        // AI FRAUD CHECK
        // =====================================================

        PredictionRequest request = new PredictionRequest();

        request.setStep(1);
        request.setType("TRANSFER");

        request.setAmount(amount.doubleValue());

        request.setOldbalanceOrg(
                sender.getBalance().doubleValue()
        );

        request.setNewbalanceOrig(
                sender.getBalance()
                        .subtract(amount)
                        .doubleValue()
        );

        request.setOldbalanceDest(
                receiver.getBalance().doubleValue()
        );

        request.setNewbalanceDest(
                receiver.getBalance()
                        .add(amount)
                        .doubleValue()
        );

        PredictionResponse prediction =
                aiService.predict(request);

        System.out.println("========== AI RESULT ==========");
        System.out.println(
                "Prediction : "
                        + prediction.getPrediction()
        );
        System.out.println(
                "Probability : "
                        + prediction.getFraud_probability()
        );
        System.out.println(
                "Risk Score : "
                        + prediction.getRisk_score()
        );
        System.out.println(
                "Risk Level : "
                        + prediction.getRisk_level()
        );

        if (prediction.getRisk_score() >= 80) {
            throw new TransactionBlockedException(
                    "Transaction blocked. Risk Level: "
                            + prediction.getRisk_level()
                            + ". Reasons: "
                            + prediction.getReasons()
            );
        }

        // =====================================================
        // UPDATE BALANCES
        // =====================================================

        sender.setBalance(
                sender.getBalance().subtract(amount)
        );

        receiver.setBalance(
                receiver.getBalance().add(amount)
        );

        accountRepository.saveAll(
                List.of(sender, receiver)
        );

        // =====================================================
        // CREATE TRANSACTIONS
        // =====================================================

        String reference =
                UUID.randomUUID().toString();

        Transaction debit = new Transaction();

        debit.setAccount(sender);
        debit.setAmount(amount);

        debit.setTransactionType(
                TransactionType.TRANSFER_OUT
        );

        debit.setStatus(
                TransactionStatus.SUCCESS
        );

        debit.setDescription(
                normalizeDescription(
                        description,
                        "Transfer to "
                                + receiver.getAccountNumber()
                )
        );

        debit.setReferenceNumber(reference);

        Transaction credit = new Transaction();

        credit.setAccount(receiver);
        credit.setAmount(amount);

        credit.setTransactionType(
                TransactionType.TRANSFER_IN
        );

        credit.setStatus(
                TransactionStatus.SUCCESS
        );

        credit.setDescription(
                "Transfer from "
                        + sender.getAccountNumber()
        );

        credit.setReferenceNumber(reference);

        transactionRepository.saveAll(
                List.of(debit, credit)
        );

        return map(debit);
    }

    // -------------------------------------------------------
    // Transaction History
    // -------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactionHistory(
            Long accountId,
            String userEmail) {

        User user = getUser(userEmail);

        Account account = accountRepository
                .findById(accountId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Account not found"));

        /*
         * Prevent users from viewing another user's
         * transaction history.
         */
        verifyOwnership(account, user);

        return transactionRepository
                .findByAccountIdOrderByCreatedAtDesc(accountId)
                .stream()
                .map(this::map)
                .toList();
    }


    // -------------------------------------------------------
    // Helpers
    // -------------------------------------------------------

    private User getUser(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"
                        )
                );
    }


    private void verifyOwnership(
            Account account,
            User user) {

        if (account.getUser() == null
                || !account.getUser().getId()
                        .equals(user.getId())) {

            throw new ForbiddenException(
                    "You are not authorized to access this account"
            );
        }
    }


    private void validateAmount(BigDecimal amount) {

        if (amount == null
                || amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new BadRequestException(
                    "Amount must be greater than zero"
            );
        }
    }


    private String normalizeDescription(
            String description,
            String fallback) {

        if (description == null
                || description.trim().isEmpty()) {

            return fallback;
        }

        return description.trim();
    }


    // -------------------------------------------------------
    // Mapper
    // -------------------------------------------------------

    private TransactionResponse map(
            Transaction transaction) {

        TransactionResponse response =
                new TransactionResponse();

        response.setTransactionId(
                transaction.getId()
        );

        response.setAmount(
                transaction.getAmount()
        );

        response.setDescription(
                transaction.getDescription()
        );

        response.setReferenceNumber(
                transaction.getReferenceNumber()
        );

        response.setStatus(
                transaction.getStatus().name()
        );

        response.setTransactionType(
                transaction.getTransactionType().name()
        );

        response.setCreatedAt(
                transaction.getCreatedAt()
        );

        return response;
    }
}
