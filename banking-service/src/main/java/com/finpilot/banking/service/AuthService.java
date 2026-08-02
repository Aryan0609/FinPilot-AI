package com.finpilot.banking.service;

import com.finpilot.banking.dto.*;
import com.finpilot.banking.dto.LoginRequest;
import com.finpilot.banking.dto.RegisterRequest;
import com.finpilot.banking.entity.Account;
import com.finpilot.banking.entity.User;
import com.finpilot.banking.repository.AccountRepository;
import com.finpilot.banking.repository.UserRepository;
import com.finpilot.banking.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Random;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       AccountRepository accountRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {

        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        userRepository.save(user);

        Account account = new Account();

        account.setAccountNumber(generateAccountNumber());

        account.setAccountType(
                request.getAccountType()
        );

        account.setBalance(
                request.getInitialBalance() == null
                        ? BigDecimal.ZERO
                        : request.getInitialBalance()
        );

        account.setUser(user);

        accountRepository.save(account);

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                "Registration Successful"
        );
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid Email"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid Password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                "Login Successful"
        );
    }

    private String generateAccountNumber() {

        Random random = new Random();

        return "AC"
                + (100000000 + random.nextInt(900000000));
    }

   public UserResponse getCurrentUser(String token) {

    System.out.println("========== GET CURRENT USER ==========");

    System.out.println("TOKEN: " + token);

    token = token.replace("Bearer ", "");

    String email = jwtService.extractEmail(token);

    System.out.println("EMAIL: " + email);

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    System.out.println("USER FOUND: " + user.getEmail());

    Account account = accountRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Account not found"));

    System.out.println("ACCOUNT FOUND: " + account.getId());

    UserResponse response = new UserResponse();

    response.setUserId(user.getId());
    response.setName(user.getName());
    response.setEmail(user.getEmail());
    response.setPhone(user.getPhone());

    response.setAccountId(account.getId());
    response.setAccountNumber(account.getAccountNumber());
    response.setBalance(account.getBalance());

    System.out.println("RETURNING RESPONSE");

    return response;
}
    

}