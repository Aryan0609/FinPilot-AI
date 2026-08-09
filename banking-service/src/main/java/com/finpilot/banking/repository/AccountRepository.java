package com.finpilot.banking.repository;

import com.finpilot.banking.entity.Account;
import com.finpilot.banking.entity.User;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByUser(User user);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Account a WHERE a.id = :id")
    Optional<Account> findByIdForUpdate(@Param("id") Long id);
    Optional<Account> findByAccountNumber(String accountNumber);

    @Query("""
        SELECT COALESCE(SUM(a.balance), 0)
        FROM Account a
    """)
    BigDecimal getTotalWalletBalance();

    @Query("""
        SELECT a
        FROM Account a
        WHERE a.id = :accountId
        AND a.user = :user
    """)
    Optional<Account> findByIdAndUser(
            @Param("accountId") Long accountId,
            @Param("user") User user
    );
}
