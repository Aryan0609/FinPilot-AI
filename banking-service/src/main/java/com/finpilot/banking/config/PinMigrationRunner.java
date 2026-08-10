package com.finpilot.banking.config;

import com.finpilot.banking.entity.User;
import com.finpilot.banking.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PinMigrationRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PinMigrationRunner(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        String pinHash = passwordEncoder.encode("1234");

        int updated = 0;

        for (User user : userRepository.findAll()) {

            if (user.getBankingPinHash() == null ||
                    user.getBankingPinHash().isBlank()) {

                user.setBankingPinHash(pinHash);
                user.setPinFailedAttempts(0);
                user.setPinLockedUntil(null);

                userRepository.save(user);
                updated++;
            }
        }

        System.out.println(
                "PIN migration completed. Users updated: " + updated
        );
    }
}
