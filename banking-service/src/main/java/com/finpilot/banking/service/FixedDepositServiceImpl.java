package com.finpilot.banking.service;

import com.finpilot.banking.dto.FDResponse;
import com.finpilot.banking.entity.Account;
import com.finpilot.banking.entity.FDStatus;
import com.finpilot.banking.entity.FixedDeposit;
import com.finpilot.banking.entity.Transaction;
import com.finpilot.banking.entity.TransactionStatus;
import com.finpilot.banking.entity.TransactionType;
import com.finpilot.banking.repository.AccountRepository;
import com.finpilot.banking.repository.FixedDepositRepository;
import com.finpilot.banking.repository.TransactionRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class FixedDepositServiceImpl implements FixedDepositService {

    private final FixedDepositRepository fixedDepositRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public FixedDepositServiceImpl(
            FixedDepositRepository fixedDepositRepository,
            AccountRepository accountRepository,
            TransactionRepository transactionRepository) {

        this.fixedDepositRepository = fixedDepositRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public FDResponse createFD(
            Long accountId,
            BigDecimal amount,
            Integer tenureMonths) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException("Invalid FD amount");
        }

        if (tenureMonths == null ||
                tenureMonths <= 0) {

            throw new RuntimeException("Invalid tenure");
        }

        if (account.getBalance().compareTo(amount) < 0) {

            throw new RuntimeException(
                    "Insufficient balance");
        }

        double interestRate = 7.0;

        BigDecimal interest = amount
                .multiply(BigDecimal.valueOf(interestRate))
                .multiply(BigDecimal.valueOf(tenureMonths))
                .divide(
                        BigDecimal.valueOf(1200),
                        2,
                        RoundingMode.HALF_UP
                );

        BigDecimal maturityAmount =
                amount.add(interest);

        // Remove money from account
        account.setBalance(
                account.getBalance().subtract(amount)
        );

        accountRepository.save(account);

        // Create FD
        FixedDeposit fd = new FixedDeposit();

        fd.setUser(account.getUser());
        fd.setPrincipalAmount(amount);
        fd.setInterestRate(interestRate);
        fd.setTenureMonths(tenureMonths);
        fd.setMaturityAmount(maturityAmount);
        fd.setStartDate(LocalDate.now());
        fd.setMaturityDate(
                LocalDate.now().plusMonths(tenureMonths)
        );
        fd.setStatus(FDStatus.ACTIVE);

        FixedDeposit savedFD =
                fixedDepositRepository.save(fd);

        // =====================================================
        // TRANSACTION RECORD
        // =====================================================

        Transaction transaction =
                new Transaction();

        transaction.setAccount(account);

        // Negative because money left the account
        transaction.setAmount(
                amount.negate()
        );

        transaction.setTransactionType(
                TransactionType.FD_INVESTMENT
        );

        transaction.setStatus(
                TransactionStatus.SUCCESS
        );

        transaction.setDescription(
                "Fixed Deposit investment #" +
                savedFD.getId()
        );

        transaction.setReferenceNumber(
                "FD-INV-" +
                savedFD.getId() +
                "-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
        );

        transactionRepository.save(transaction);

        return map(savedFD);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FDResponse> getUserFDs(Long userId) {

        return fixedDepositRepository
                .findByUserId(userId)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public FDResponse closeFD(Long fdId) {

        FixedDeposit fd =
                fixedDepositRepository
                        .findById(fdId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "FD not found"
                                ));

        if (fd.getStatus() != FDStatus.ACTIVE) {

            throw new RuntimeException(
                    "FD is already closed"
            );
        }

        Account account =
                accountRepository
                        .findByUser(fd.getUser())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Account not found"
                                ));

        BigDecimal maturityAmount =
                fd.getMaturityAmount();

        // Return maturity amount to account
        account.setBalance(
                account.getBalance()
                        .add(maturityAmount)
        );

        accountRepository.save(account);

        fd.setStatus(FDStatus.CLOSED);

        FixedDeposit savedFD =
                fixedDepositRepository.save(fd);

        // =====================================================
        // TRANSACTION RECORD
        // =====================================================

        Transaction transaction =
                new Transaction();

        transaction.setAccount(account);

        // Positive because money returned to account
        transaction.setAmount(
                maturityAmount
        );

        transaction.setTransactionType(
                TransactionType.FD_CLOSURE
        );

        transaction.setStatus(
                TransactionStatus.SUCCESS
        );

        transaction.setDescription(
                "Fixed Deposit closure #" +
                savedFD.getId()
        );

        transaction.setReferenceNumber(
                "FD-CLOSE-" +
                savedFD.getId() +
                "-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
        );

        transactionRepository.save(transaction);

        return map(savedFD);
    }

    private FDResponse map(FixedDeposit fd) {

        FDResponse response =
                new FDResponse();

        response.setId(fd.getId());
        response.setPrincipalAmount(
                fd.getPrincipalAmount()
        );
        response.setInterestRate(
                fd.getInterestRate()
        );
        response.setTenureMonths(
                fd.getTenureMonths()
        );
        response.setMaturityAmount(
                fd.getMaturityAmount()
        );
        response.setStartDate(
                fd.getStartDate()
        );
        response.setMaturityDate(
                fd.getMaturityDate()
        );
        response.setStatus(
                fd.getStatus().name()
        );

        return response;
    }
}
