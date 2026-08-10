package com.finpilot.banking.dto;

public class PredictionRequest {

    private int step;
    private String type;

    private double amount;

    private double oldbalanceOrg;
    private double newbalanceOrig;

    private double oldbalanceDest;
    private double newbalanceDest;

    private int device_trusted = 1;
    private int location_match = 1;
    private int velocity = 1;
    private int failed_login_count = 0;
    private double ip_risk_score = 0.0;
    private int account_age_days = 365;

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

    public int getDevice_trusted() {
        return device_trusted;
    }

    public void setDevice_trusted(int device_trusted) {
        this.device_trusted = device_trusted;
    }

    public int getLocation_match() {
        return location_match;
    }

    public void setLocation_match(int location_match) {
        this.location_match = location_match;
    }

    public int getVelocity() {
        return velocity;
    }

    public void setVelocity(int velocity) {
        this.velocity = velocity;
    }

    public int getFailed_login_count() {
        return failed_login_count;
    }

    public void setFailed_login_count(int failed_login_count) {
        this.failed_login_count = failed_login_count;
    }

    public double getIp_risk_score() {
        return ip_risk_score;
    }

    public void setIp_risk_score(double ip_risk_score) {
        this.ip_risk_score = ip_risk_score;
    }

    public int getAccount_age_days() {
        return account_age_days;
    }

    public void setAccount_age_days(int account_age_days) {
        this.account_age_days = account_age_days;
    }
}
