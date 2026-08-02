package com.finpilot.banking.controller;

import com.finpilot.banking.dto.DepositRequest;
import com.finpilot.banking.dto.TransactionResponse;
import com.finpilot.banking.dto.TransferRequest;
import com.finpilot.banking.dto.WithdrawRequest;
import com.finpilot.banking.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponse> deposit(
            @RequestBody DepositRequest request) {

        return ResponseEntity.ok(
                transactionService.deposit(
                        request.getAccountId(),
                        request.getAmount()
                )
        );
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(
            @RequestBody WithdrawRequest request) {

        return ResponseEntity.ok(
                transactionService.withdraw(
                        request.getAccountId(),
                        request.getAmount()
                )
        );
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(
            @RequestBody TransferRequest request) {

        return ResponseEntity.ok(
                transactionService.transfer(
                        request.getFromAccountId(),
                        request.getToAccountId(),
                        request.getAmount()
                )
        );
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<TransactionResponse>> history(
            @PathVariable Long accountId) {

        return ResponseEntity.ok(
                transactionService.getTransactionHistory(accountId)
        );
    }
}