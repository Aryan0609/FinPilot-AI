package com.finpilot.banking.repository;

import com.finpilot.banking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    
    
    List<User> findTop5ByOrderByCreatedAtDesc();
    Optional<User> findByEmail(String email);
    long count();

    boolean existsByEmail(String email);
}