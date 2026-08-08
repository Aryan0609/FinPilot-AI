package com.finpilot.banking.repository;

import com.finpilot.banking.entity.Account;
import com.finpilot.banking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByUser(User user);

    @Query("""
        SELECT COALESCE(SUM(a.balance), 0)
        FROM Account a
    """)
    BigDecimal getTotalWalletBalance();
}