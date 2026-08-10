package com.finpilot.banking.dto;

import java.math.BigDecimal;

public class MutualFundRequest {

    private String bankingPin;

    private Long fundId;

    private BigDecimal amount;

    public MutualFundRequest() {
    }

    public Long getFundId() {
        return fundId;
    }

    public void setFundId(Long fundId) {
        this.fundId = fundId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getBankingPin() {
        return bankingPin;
    }

    public void setBankingPin(String bankingPin) {
        this.bankingPin = bankingPin;
    }
}
