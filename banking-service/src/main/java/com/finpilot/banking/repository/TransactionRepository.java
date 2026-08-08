package com.finpilot.banking.repository;

import com.finpilot.banking.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccountIdOrderByCreatedAtDesc(Long accountId);

    List<Transaction> findTop5ByAccountIdOrderByCreatedAtDesc(Long accountId);

    List<Transaction> findTop5ByOrderByCreatedAtDesc();
    List<Transaction> findTop10ByOrderByCreatedAtDesc();
    Transaction findByReferenceNumber(String referenceNumber);

}