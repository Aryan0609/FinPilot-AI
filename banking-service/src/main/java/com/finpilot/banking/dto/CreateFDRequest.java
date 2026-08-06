package com.finpilot.banking.dto;

import java.math.BigDecimal;

public class CreateFDRequest {

    private Long accountId;

    private BigDecimal amount;

    private Integer tenureMonths;

    public CreateFDRequest() {
    }

    public Long getAccountId() {
        return accountId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }
}