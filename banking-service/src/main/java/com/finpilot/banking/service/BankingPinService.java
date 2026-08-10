package com.finpilot.banking.service;

import com.finpilot.banking.entity.User;
import com.finpilot.banking.exception.BankingPinLockedException;
import com.finpilot.banking.exception.InvalidBankingPinException;
import com.finpilot.banking.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class BankingPinService {

    private static final int MAX_FAILED_ATTEMPTS = 3;
    private static final int LOCK_MINUTES = 15;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public BankingPinService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(
            propagation = Propagation.REQUIRES_NEW,
            noRollbackFor = {
                    InvalidBankingPinException.class,
                    BankingPinLockedException.class
            }
    )
    public void verifyPin(String userEmail, String pin) {

        if (pin == null || !pin.matches("\\d{4}")) {
            throw new InvalidBankingPinException(
                    "Banking PIN must be exactly 4 digits"
            );
        }

        User user = userRepository
                .findByEmail(userEmail)
                .orElseThrow(() ->
                        new InvalidBankingPinException(
                                "Unable to verify banking PIN"
                        )
                );

        LocalDateTime now = LocalDateTime.now();

        // Check active lock using freshly loaded database state.
        if (user.getPinLockedUntil() != null &&
                user.getPinLockedUntil().isAfter(now)) {

            throw new BankingPinLockedException(
                    "Banking PIN is temporarily locked"
            );
        }

        // Clear an expired lock.
        if (user.getPinLockedUntil() != null &&
                !user.getPinLockedUntil().isAfter(now)) {

            user.setPinLockedUntil(null);
            user.setPinFailedAttempts(0);
        }

        // Validate PIN against BCrypt hash.
        if (!passwordEncoder.matches(
                pin,
                user.getBankingPinHash())) {

            int attempts =
                    user.getPinFailedAttempts() == null
                            ? 0
                            : user.getPinFailedAttempts();

            attempts++;

            user.setPinFailedAttempts(attempts);

            if (attempts >= MAX_FAILED_ATTEMPTS) {

                user.setPinLockedUntil(
                        now.plusMinutes(LOCK_MINUTES)
                );

                userRepository.save(user);

                throw new BankingPinLockedException(
                        "Too many incorrect PIN attempts. Try again later."
                );
            }

            userRepository.save(user);

            throw new InvalidBankingPinException(
                    "Invalid banking PIN"
            );
        }

        // Correct PIN clears previous failed attempts.
        user.setPinFailedAttempts(0);
        user.setPinLockedUntil(null);

        userRepository.save(user);
    }
}
