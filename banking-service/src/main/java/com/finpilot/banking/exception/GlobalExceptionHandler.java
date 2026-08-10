package com.finpilot.banking.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<?> handleInsufficientBalance(
            InsufficientBalanceException ex) {

        return build(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleNotFound(
            ResourceNotFoundException ex) {

        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<?> handleBadRequest(
            BadRequestException ex) {

        return build(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<?> handleForbidden(
            ForbiddenException ex) {

        return build(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler(TransactionBlockedException.class)
    public ResponseEntity<?> handleTransactionBlocked(
            TransactionBlockedException ex) {

        return build(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler(AIServiceException.class)
    public ResponseEntity<?> handleAIService(
            AIServiceException ex) {

        return build(
                HttpStatus.SERVICE_UNAVAILABLE,
                ex.getMessage()
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneric(Exception ex) {

        return build(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred"
        );
    }

    private ResponseEntity<?> build(
            HttpStatus status,
            String message) {

        return ResponseEntity
                .status(status)
                .body(Map.of(
                        "status", status.value(),
                        "message", message,
                        "timestamp", LocalDateTime.now()
                ));
    }
}
