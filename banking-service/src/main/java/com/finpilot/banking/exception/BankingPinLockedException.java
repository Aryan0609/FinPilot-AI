package com.finpilot.banking.exception;

public class BankingPinLockedException extends RuntimeException {

    public BankingPinLockedException(String message) {
        super(message);
    }
}
