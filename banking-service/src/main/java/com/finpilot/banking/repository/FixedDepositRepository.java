package com.finpilot.banking.repository;

import com.finpilot.banking.entity.FixedDeposit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FixedDepositRepository
        extends JpaRepository<FixedDeposit, Long> {

    List<FixedDeposit> findByUserId(Long userId);
}