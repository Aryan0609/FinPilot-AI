package com.finpilot.banking.service;

import com.finpilot.banking.dto.TransactionResponse;

import java.math.BigDecimal;
import java.util.List;

public interface TransactionService {

    TransactionResponse deposit(
            Long accountId,
            BigDecimal amount,
            String description,
            String bankingPin,
            String userEmail
    );

    TransactionResponse withdraw(
            Long accountId,
            BigDecimal amount,
            String description,
            String bankingPin,
            String userEmail
    );

    TransactionResponse transfer(
            String toAccountNumber,
            BigDecimal amount,
            String description,
            String bankingPin,
            String userEmail
    );

    List<TransactionResponse> getTransactionHistory(
            Long accountId,
            String userEmail
    );
}
