package com.finpilot.banking.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class FDResponse {

    private Long id;

    private BigDecimal principalAmount;

    private Double interestRate;

    private Integer tenureMonths;

    private BigDecimal maturityAmount;

    private LocalDate startDate;

    private LocalDate maturityDate;

    private String status;

    public FDResponse() {
    }

    public Long getId() {
        return id;
    }

    public BigDecimal getPrincipalAmount() {
        return principalAmount;
    }

    public Double getInterestRate() {
        return interestRate;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public BigDecimal getMaturityAmount() {
        return maturityAmount;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getMaturityDate() {
        return maturityDate;
    }

    public String getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPrincipalAmount(BigDecimal principalAmount) {
        this.principalAmount = principalAmount;
    }

    public void setInterestRate(Double interestRate) {
        this.interestRate = interestRate;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }

    public void setMaturityAmount(BigDecimal maturityAmount) {
        this.maturityAmount = maturityAmount;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setMaturityDate(LocalDate maturityDate) {
        this.maturityDate = maturityDate;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}