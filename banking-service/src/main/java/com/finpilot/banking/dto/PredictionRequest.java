package com.finpilot.banking.dto;

public class PredictionRequest {

    private int step;
    private String type;

    private double amount;

    private double oldbalanceOrg;
    private double newbalanceOrig;

    private double oldbalanceDest;
    private double newbalanceDest;

    public PredictionRequest() {
    }

    public int getStep() {
        return step;
    }

    public void setStep(int step) {
        this.step = step;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public double getOldbalanceOrg() {
        return oldbalanceOrg;
    }

    public void setOldbalanceOrg(double oldbalanceOrg) {
        this.oldbalanceOrg = oldbalanceOrg;
    }

    public double getNewbalanceOrig() {
        return newbalanceOrig;
    }

    public void setNewbalanceOrig(double newbalanceOrig) {
        this.newbalanceOrig = newbalanceOrig;
    }

    public double getOldbalanceDest() {
        return oldbalanceDest;
    }

    public void setOldbalanceDest(double oldbalanceDest) {
        this.oldbalanceDest = oldbalanceDest;
    }

    public double getNewbalanceDest() {
        return newbalanceDest;
    }

    public void setNewbalanceDest(double newbalanceDest) {
        this.newbalanceDest = newbalanceDest;
    }
}