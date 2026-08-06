package com.finpilot.banking.dto;

import java.math.BigDecimal;

public class AdminDashboardResponse {

    private long totalUsers;
    private long totalTransactions;
    private BigDecimal totalWalletBalance;
    private long fraudAlerts;
    private String aiStatus;

    public AdminDashboardResponse() {
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public BigDecimal getTotalWalletBalance() {
        return totalWalletBalance;
    }

    public void setTotalWalletBalance(BigDecimal totalWalletBalance) {
        this.totalWalletBalance = totalWalletBalance;
    }

    public long getFraudAlerts() {
        return fraudAlerts;
    }

    public void setFraudAlerts(long fraudAlerts) {
        this.fraudAlerts = fraudAlerts;
    }

    public String getAiStatus() {
        return aiStatus;
    }

    public void setAiStatus(String aiStatus) {
        this.aiStatus = aiStatus;
    }
}
