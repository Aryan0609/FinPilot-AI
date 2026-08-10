package com.finpilot.banking.exception;

public class InvalidBankingPinException extends RuntimeException {

    public InvalidBankingPinException(String message) {
        super(message);
    }
}
