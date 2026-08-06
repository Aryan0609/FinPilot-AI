package com.finpilot.banking.service;

import com.finpilot.banking.dto.AdminDashboardResponse;
import com.finpilot.banking.dto.AdminUserResponse;
import com.finpilot.banking.entity.Role;
import com.finpilot.banking.repository.AccountRepository;
import com.finpilot.banking.repository.TransactionRepository;
import com.finpilot.banking.repository.UserRepository;
import com.finpilot.banking.dto.AdminTransactionResponse;
import com.finpilot.banking.entity.Transaction;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    public AdminService(
            UserRepository userRepository,
            TransactionRepository transactionRepository,
            AccountRepository accountRepository) {

        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
    }

    public List<AdminUserResponse> getRecentUsers() {

    return userRepository.findTop5ByOrderByCreatedAtDesc()
            .stream()
            .map(user -> {

                AdminUserResponse dto = new AdminUserResponse();

                dto.setId(user.getId());
                dto.setName(user.getName());
                dto.setEmail(user.getEmail());
                dto.setPhone(user.getPhone());

                dto.setRoles(
                        user.getRoles()
                                .stream()
                                .map(Role::getRoleName)
                                .collect(Collectors.toSet())
                );

                return dto;

            })
            .toList();
}

    // ================= Dashboard =================

    public AdminDashboardResponse getDashboard() {

        AdminDashboardResponse response = new AdminDashboardResponse();

        response.setTotalUsers(userRepository.count());

        response.setTotalTransactions(transactionRepository.count());

        response.setTotalWalletBalance(
                accountRepository.getTotalWalletBalance());

        response.setFraudAlerts(0);

        response.setAiStatus("ONLINE");

        return response;
    }

    // ================= Users =================

    public List<AdminUserResponse> getUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> {

                    AdminUserResponse dto = new AdminUserResponse();

                    dto.setId(user.getId());
                    dto.setName(user.getName());
                    dto.setEmail(user.getEmail());
                    dto.setPhone(user.getPhone());

                    dto.setRoles(
                            user.getRoles()
                                    .stream()
                                    .map(Role::getRoleName)
                                    .collect(Collectors.toSet())
                    );

                    return dto;

                })
                .toList();
    }

    public List<AdminTransactionResponse> getRecentTransactions() {

    return transactionRepository
            .findTop5ByOrderByCreatedAtDesc()
            .stream()
            .map(transaction -> {

                AdminTransactionResponse dto =
                        new AdminTransactionResponse();

                dto.setId(transaction.getId());

                dto.setTransactionType(
                        transaction.getTransactionType().name()
                );

                dto.setAmount(transaction.getAmount());

                dto.setTransactionDate(
                        transaction.getCreatedAt()
                );

                return dto;

            })
            .toList();
}

}