package com.finpilot.banking.controller;

import com.finpilot.banking.dto.DashboardResponse;
import com.finpilot.banking.entity.Account;
import com.finpilot.banking.entity.User;
import com.finpilot.banking.repository.UserRepository;
import com.finpilot.banking.service.AccountService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/accounts")
public class AccountController {

    private final AccountService accountService;
    private final UserRepository userRepository;

    public AccountController(
            AccountService accountService,
            UserRepository userRepository) {

        this.accountService = accountService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public Account createAccount(@RequestBody Account account) {
        return accountService.createAccount(account);
    }

    @GetMapping("/{id}")
    public Account getAccount(@PathVariable Long id) {
        return accountService.getAccount(id);
    }

    @GetMapping("/{id}/balance")
    public BigDecimal getBalance(@PathVariable Long id) {
        return accountService.getBalance(id);
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return accountService.getDashboard(user);
    }
}