
package com.finpilot.banking.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class InvestmentResponse {

    private Long investmentId;

    private String fundName;

    private BigDecimal investedAmount;

    private BigDecimal units;

    private BigDecimal purchaseNav;

    private BigDecimal currentNav;

    private BigDecimal currentValue;

    private BigDecimal profitLoss;

    private LocalDateTime investmentDate;

    public InvestmentResponse() {
    }

    public Long getInvestmentId() {
        return investmentId;
    }

    public void setInvestmentId(Long investmentId) {
        this.investmentId = investmentId;
    }

    public String getFundName() {
        return fundName;
    }

    public void setFundName(String fundName) {
        this.fundName = fundName;
    }

    public BigDecimal getInvestedAmount() {
        return investedAmount;
    }

    public void setInvestedAmount(BigDecimal investedAmount) {
        this.investedAmount = investedAmount;
    }

    public BigDecimal getUnits() {
        return units;
    }

    public void setUnits(BigDecimal units) {
        this.units = units;
    }

    public BigDecimal getPurchaseNav() {
        return purchaseNav;
    }

    public void setPurchaseNav(BigDecimal purchaseNav) {
        this.purchaseNav = purchaseNav;
    }

    public BigDecimal getCurrentNav() {
        return currentNav;
    }

    public void setCurrentNav(BigDecimal currentNav) {
        this.currentNav = currentNav;
    }

    public BigDecimal getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(BigDecimal currentValue) {
        this.currentValue = currentValue;
    }

    public BigDecimal getProfitLoss() {
        return profitLoss;
    }

    public void setProfitLoss(BigDecimal profitLoss) {
        this.profitLoss = profitLoss;
    }

    public LocalDateTime getInvestmentDate() {
        return investmentDate;
    }

    public void setInvestmentDate(LocalDateTime investmentDate) {
        this.investmentDate = investmentDate;
    }
}