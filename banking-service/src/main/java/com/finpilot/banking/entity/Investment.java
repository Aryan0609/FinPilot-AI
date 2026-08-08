package com.finpilot.banking.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "investments")
public class Investment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fund_id", nullable = false)
    private MutualFund mutualFund;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal investmentAmount;

    @Column(nullable = false, precision = 12, scale = 4)
    private BigDecimal unitsPurchased;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal purchaseNav;

    @Column(nullable = false)
    private LocalDateTime investmentDate;

    public Investment() {
    }

    @PrePersist
    public void onCreate() {
        investmentDate = LocalDateTime.now();
    }

    @Transient
    public BigDecimal getCurrentValue() {
        if (mutualFund == null || mutualFund.getNav() == null) {
            return BigDecimal.ZERO;
        }
        return unitsPurchased.multiply(mutualFund.getNav());
    }

    @Transient
    public BigDecimal getProfitLoss() {
        return getCurrentValue().subtract(investmentAmount);
    }

    // ---------------- Getters ----------------

    public Long getId() {
        return id;
    }

    public Account getAccount() {
        return account;
    }

    public MutualFund getMutualFund() {
        return mutualFund;
    }

    public BigDecimal getInvestmentAmount() {
        return investmentAmount;
    }

    public BigDecimal getUnitsPurchased() {
        return unitsPurchased;
    }

    public BigDecimal getPurchaseNav() {
        return purchaseNav;
    }

    public LocalDateTime getInvestmentDate() {
        return investmentDate;
    }

    // ---------------- Setters ----------------

    public void setId(Long id) {
        this.id = id;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public void setMutualFund(MutualFund mutualFund) {
        this.mutualFund = mutualFund;
    }

    public void setInvestmentAmount(BigDecimal investmentAmount) {
        this.investmentAmount = investmentAmount;
    }

    public void setUnitsPurchased(BigDecimal unitsPurchased) {
        this.unitsPurchased = unitsPurchased;
    }

    public void setPurchaseNav(BigDecimal purchaseNav) {
        this.purchaseNav = purchaseNav;
    }

    public void setInvestmentDate(LocalDateTime investmentDate) {
        this.investmentDate = investmentDate;
    }
}