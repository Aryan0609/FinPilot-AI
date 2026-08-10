package com.finpilot.banking.dto;

import java.math.BigDecimal;

public class RegisterRequest {

    private String name;
    private String email;
    private String password;
    private String phone;
    private String accountType;
    private BigDecimal initialBalance;
    private String bankingPin;

    public RegisterRequest() {
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getPhone() {
        return phone;
    }

    public String getAccountType() {
        return accountType;
    }

    public BigDecimal getInitialBalance() {
        return initialBalance;
    }

    public String getBankingPin() {
        return bankingPin;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public void setInitialBalance(BigDecimal initialBalance) {
        this.initialBalance = initialBalance;
    }

    public void setBankingPin(String bankingPin) {
        this.bankingPin = bankingPin;
    }
}
