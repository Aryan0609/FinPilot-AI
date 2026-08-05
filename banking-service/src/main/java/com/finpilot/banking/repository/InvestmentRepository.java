package com.finpilot.banking.repository;

import com.finpilot.banking.entity.Account;
import com.finpilot.banking.entity.Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestmentRepository
        extends JpaRepository<Investment, Long> {

    List<Investment> findByAccount(Account account);

}