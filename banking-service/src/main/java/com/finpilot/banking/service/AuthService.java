package com.finpilot.banking.service;

import com.finpilot.banking.dto.AuthResponse;
import com.finpilot.banking.dto.LoginRequest;
import com.finpilot.banking.dto.RegisterRequest;
import com.finpilot.banking.dto.UserResponse;
import com.finpilot.banking.entity.Account;
import com.finpilot.banking.entity.Role;
import com.finpilot.banking.entity.User;
import com.finpilot.banking.repository.AccountRepository;
import com.finpilot.banking.repository.RoleRepository;
import com.finpilot.banking.repository.UserRepository;
import com.finpilot.banking.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Random;
import java.util.stream.Collectors;


@Service
public class AuthService {


    private final UserRepository userRepository;

    private final AccountRepository accountRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final RoleRepository roleRepository;



    public AuthService(
            UserRepository userRepository,
            AccountRepository accountRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            RoleRepository roleRepository
    ){

        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.roleRepository = roleRepository;

    }



    public AuthResponse register(RegisterRequest request){


        if(userRepository.existsByEmail(request.getEmail())){

            throw new RuntimeException(
                    "Email already exists"
            );
        }


        User user = new User();

        user.setName(request.getName());

        user.setEmail(request.getEmail());

        user.setPhone(request.getPhone());


        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );



    
    // Banking PIN must be exactly 4 numeric digits
    if (request.getBankingPin() == null ||
            !request.getBankingPin().matches("\\d{4}")) {

        throw new RuntimeException(
                "Banking PIN must be exactly 4 digits"
        );
    }

    // Never store the banking PIN in plain text
    user.setBankingPinHash(
            passwordEncoder.encode(
                    request.getBankingPin()
            )
    );

    user.setPinFailedAttempts(0);
    user.setPinLockedUntil(null);

    Role userRole =
                roleRepository
                .findByRoleName("ROLE_USER")
                .orElseThrow(() ->
                        new RuntimeException(
                                "ROLE_USER not found"
                        )
                );


        user.getRoles()
                .add(userRole);



        User savedUser =
                userRepository.save(user);



        Account account = new Account();


        account.setAccountNumber(
                generateAccountNumber()
        );


        account.setAccountType(
                request.getAccountType()
        );


        account.setBalance(
                request.getInitialBalance()==null
                ?
                BigDecimal.ZERO
                :
                request.getInitialBalance()
        );


        account.setUser(savedUser);



        accountRepository.save(account);



        String token =
                jwtService.generateToken(savedUser);



        return new AuthResponse(
                token,
                "Registration Successful"
        );

    }





    public AuthResponse login(LoginRequest request){


        User user =
                userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid Email"
                        )
                );



        if(!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )){

            throw new RuntimeException(
                    "Invalid Password"
            );

        }



        String token =
                jwtService.generateToken(user);



        return new AuthResponse(
                token,
                "Login Successful"
        );

    }






    public UserResponse getCurrentUser(String token){


        token =
        token.replace(
                "Bearer ",
                ""
        );


        String email =
                jwtService.extractEmail(token);



        User user =
                userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );



        Account account =
                accountRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Account not found"
                        )
                );



        UserResponse response =
                new UserResponse();



        response.setUserId(
                user.getId()
        );


        response.setName(
                user.getName()
        );


        response.setEmail(
                user.getEmail()
        );


        response.setPhone(
                user.getPhone()
        );


        response.setAccountId(
                account.getId()
        );


        response.setAccountNumber(
                account.getAccountNumber()
        );


        response.setBalance(
                account.getBalance()
        );


        response.setRoles(
                user.getRoles()
                .stream()
                .map(Role::getRoleName)
                .collect(Collectors.toSet())
        );


        return response;

    }






    private String generateAccountNumber(){


        Random random = new Random();


        return "AC"
                +
                (100000000 +
                random.nextInt(900000000));

    }


}