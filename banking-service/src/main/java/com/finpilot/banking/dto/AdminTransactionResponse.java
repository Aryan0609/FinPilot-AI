package com.finpilot.banking.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminTransactionResponse {

    private Long id;
    private String transactionType;
    private BigDecimal amount;
    private LocalDateTime transactionDate;

    public AdminTransactionResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }
}