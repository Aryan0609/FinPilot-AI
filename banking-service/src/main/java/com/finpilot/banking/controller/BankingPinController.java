package com.finpilot.banking.controller;

import com.finpilot.banking.dto.BankingPinRequest;
import com.finpilot.banking.service.BankingPinService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/pin")
public class BankingPinController {

    private final BankingPinService bankingPinService;

    public BankingPinController(
            BankingPinService bankingPinService) {

        this.bankingPinService = bankingPinService;
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPin(
            @RequestBody BankingPinRequest request,
            Authentication authentication) {

        bankingPinService.verifyPin(
                authentication.getName(),
                request.getPin()
        );

        return ResponseEntity.ok(
                java.util.Map.of(
                        "success", true,
                        "message", "PIN verified"
                )
        );
    }
}
