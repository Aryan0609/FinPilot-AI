package com.finpilot.banking.dto;

import java.util.List;

public class PredictionResponse {

    private int prediction;

    private double fraud_probability;

    private double risk_score;

    private String risk_level;

    private List<String> reasons;

    public PredictionResponse() {
    }

    public int getPrediction() {
        return prediction;
    }

    public void setPrediction(int prediction) {
        this.prediction = prediction;
    }

    public double getFraud_probability() {
        return fraud_probability;
    }

    public void setFraud_probability(double fraud_probability) {
        this.fraud_probability = fraud_probability;
    }

    public double getRisk_score() {
        return risk_score;
    }

    public void setRisk_score(double risk_score) {
        this.risk_score = risk_score;
    }

    public String getRisk_level() {
        return risk_level;
    }

    public void setRisk_level(String risk_level) {
        this.risk_level = risk_level;
    }

    public List<String> getReasons() {
        return reasons;
    }

    public void setReasons(List<String> reasons) {
        this.reasons = reasons;
    }
}