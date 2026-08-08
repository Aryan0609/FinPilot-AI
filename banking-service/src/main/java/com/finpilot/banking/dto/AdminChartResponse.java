package com.finpilot.banking.dto;

public class AdminChartResponse {

    private String label;
    private Long transactions;

    public AdminChartResponse() {
    }

    public AdminChartResponse(String label, Long transactions) {
        this.label = label;
        this.transactions = transactions;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Long getTransactions() {
        return transactions;
    }

    public void setTransactions(Long transactions) {
        this.transactions = transactions;
    }
}