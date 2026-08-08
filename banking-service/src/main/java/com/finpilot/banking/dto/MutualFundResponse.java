package com.finpilot.banking.dto;

import java.math.BigDecimal;

public class MutualFundResponse {

    private Long id;

    private String fundName;

    private String fundType;

    private BigDecimal nav;

    private String riskLevel;

    private Double annualReturn;

    public MutualFundResponse() {
    }

    public Long getId() {
        return id;
    }

    public String getFundName() {
        return fundName;
    }

    public String getFundType() {
        return fundType;
    }

    public BigDecimal getNav() {
        return nav;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public Double getAnnualReturn() {
        return annualReturn;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFundName(String fundName) {
        this.fundName = fundName;
    }

    public void setFundType(String fundType) {
        this.fundType = fundType;
    }

    public void setNav(BigDecimal nav) {
        this.nav = nav;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public void setAnnualReturn(Double annualReturn) {
        this.annualReturn = annualReturn;
    }
} 
