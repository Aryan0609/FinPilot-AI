package com.finpilot.banking.service;

import com.finpilot.banking.dto.DashboardResponse;
import com.finpilot.banking.dto.TransactionResponse;
import com.finpilot.banking.entity.Account;
import com.finpilot.banking.entity.User;
import com.finpilot.banking.repository.AccountRepository;
import com.finpilot.banking.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    public AccountServiceImpl(
            AccountRepository accountRepository,
            TransactionRepository transactionRepository) {

        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    public DashboardResponse getDashboard(User user) {

        Account account = accountRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));

        DashboardResponse response = new DashboardResponse();

        response.setAccountNumber(account.getAccountNumber());
        response.setAccountType(account.getAccountType());
        response.setBalance(account.getBalance());

        List<TransactionResponse> transactions =
                transactionRepository
                        .findTop5ByAccountIdOrderByCreatedAtDesc(
                                account.getId()
                        )
                        .stream()
                        .map(tx -> {

                            TransactionResponse dto =
                                    new TransactionResponse();

                            dto.setTransactionId(tx.getId());
                            dto.setReferenceNumber(
                                    tx.getReferenceNumber()
                            );
                            dto.setTransactionType(
                                    tx.getTransactionType().name()
                            );
                            dto.setStatus(
                                    tx.getStatus().name()
                            );
                            dto.setAmount(tx.getAmount());
                            dto.setDescription(tx.getDescription());
                            dto.setCreatedAt(tx.getCreatedAt());

                            return dto;
                        })
                        .toList();

        response.setRecentTransactions(transactions);

        return response;
    }

    @Override
    public Account getAccount(Long id, User user) {

        return accountRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));
    }

    @Override
    public java.math.BigDecimal getBalance(Long id, User user) {

        Account account = accountRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));

        return account.getBalance();
    }
}
