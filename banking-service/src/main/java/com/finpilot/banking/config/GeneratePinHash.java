package com.finpilot.banking.config;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GeneratePinHash {
    public static void main(String[] args) {
        System.out.println(
            new BCryptPasswordEncoder().encode("1234")
        );
    }
}
