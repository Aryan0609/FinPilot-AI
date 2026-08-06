package com.finpilot.banking.repository;

import java.util.Optional;

import com.finpilot.banking.entity.Account;
import com.finpilot.banking.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AccountRepository 
        extends JpaRepository<Account, Long> {


    Optional<Account> findByUser(User user);

}