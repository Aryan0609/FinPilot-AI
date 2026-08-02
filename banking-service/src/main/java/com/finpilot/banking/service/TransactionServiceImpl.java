package com.finpilot.banking.service;

import com.finpilot.banking.dto.TransactionResponse;
import com.finpilot.banking.entity.Account;
import com.finpilot.banking.entity.Transaction;
import com.finpilot.banking.entity.TransactionStatus;
import com.finpilot.banking.entity.TransactionType;
import com.finpilot.banking.repository.AccountRepository;
import com.finpilot.banking.repository.TransactionRepository;
import com.finpilot.banking.dto.PredictionRequest;
import com.finpilot.banking.dto.PredictionResponse;
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
    private AIService aiService;

    // -------------------------------------------------------
    // Deposit
    // -------------------------------------------------------

    @Override
    @Transactional
    public TransactionResponse deposit(Long accountId,
                                       BigDecimal amount) {

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Invalid amount");
        }

        Account account = accountRepository
                .findById(accountId)
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));

        account.setBalance(
                account.getBalance().add(amount)
        );

        accountRepository.save(account);

        Transaction transaction = new Transaction();

        transaction.setAccount(account);
        transaction.setAmount(amount);
        transaction.setTransactionType(TransactionType.DEPOSIT);
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setDescription("Cash Deposit");
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
    public TransactionResponse withdraw(Long accountId,
                                        BigDecimal amount) {

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Invalid amount");
        }

        Account account = accountRepository
                .findById(accountId)
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));

        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient Balance");
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
        transaction.setDescription("Cash Withdrawal");
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
    public TransactionResponse transfer(Long fromAccountId,
                                        Long toAccountId,
                                        BigDecimal amount) {

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException(
                    "Amount must be greater than zero"
            );
        }

        if (fromAccountId.equals(toAccountId)) {
            throw new RuntimeException(
                    "Cannot transfer to same account"
            );
        }

        Account sender = accountRepository
                .findById(fromAccountId)
                .orElseThrow(() ->
                        new RuntimeException("Sender not found"));

        Account receiver = accountRepository
                .findById(toAccountId)
                .orElseThrow(() ->
                        new RuntimeException("Receiver not found"));

        if (sender.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException(
                    "Insufficient Balance"
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
System.out.println("Prediction : " + prediction.getPrediction());
System.out.println("Probability : " + prediction.getFraud_probability());
System.out.println("Risk Score : " + prediction.getRisk_score());
System.out.println("Risk Level : " + prediction.getRisk_level());

if (prediction.getRisk_score() >= 80) {

    throw new RuntimeException(
            "Transaction Blocked\n\n"
            + "Risk Level : "
            + prediction.getRisk_level()
            + "\n\nReasons : "
            + prediction.getReasons()
    );
}

        sender.setBalance(
                sender.getBalance().subtract(amount)
        );

        receiver.setBalance(
                receiver.getBalance().add(amount)
        );

        accountRepository.saveAll(
                List.of(sender, receiver)
        );

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
                "Transfer to "
                        + receiver.getAccountNumber()
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
    public List<TransactionResponse> getTransactionHistory(Long accountId) {

        return transactionRepository
                .findByAccountIdOrderByCreatedAtDesc(accountId)
                .stream()
                .map(this::map)
                .toList();

    }

    // -------------------------------------------------------
    // Mapper
    // -------------------------------------------------------

    private TransactionResponse map(Transaction transaction) {

        TransactionResponse response = new TransactionResponse();

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