package com.finpilot.banking.controller;

import com.finpilot.banking.dto.*;
import com.finpilot.banking.dto.LoginRequest;
import com.finpilot.banking.dto.RegisterRequest;
import com.finpilot.banking.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(
            @RequestBody RegisterRequest request) {

        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }

    @GetMapping("/me")
    public UserResponse currentUser(
        @RequestHeader("Authorization") String token) {

    return authService.getCurrentUser(token);
}
}