package com.finpilot.banking.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mutual_funds")
public class MutualFund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fundName;

    @Column(nullable = false)
    private String fundType;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal nav;

    @Column(nullable = false)
    private String riskLevel;

    @Column(nullable = false)
    private Double annualReturn;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "mutualFund",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Investment> investments = new ArrayList<>();

    public MutualFund() {
    }

    public MutualFund(String fundName,
                      String fundType,
                      BigDecimal nav,
                      String riskLevel,
                      Double annualReturn) {

        this.fundName = fundName;
        this.fundType = fundType;
        this.nav = nav;
        this.riskLevel = riskLevel;
        this.annualReturn = annualReturn;
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<Investment> getInvestments() {
        return investments;
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

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setInvestments(List<Investment> investments) {
        this.investments = investments;
    }
}