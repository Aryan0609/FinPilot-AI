package com.finpilot.banking.service;

import com.finpilot.banking.dto.AdminDashboardResponse;
import com.finpilot.banking.dto.AdminUserResponse;
import com.finpilot.banking.entity.Role;
import com.finpilot.banking.repository.AccountRepository;
import com.finpilot.banking.repository.TransactionRepository;
import com.finpilot.banking.repository.UserRepository;
import com.finpilot.banking.dto.AdminTransactionResponse;
import com.finpilot.banking.entity.Transaction;
import com.finpilot.banking.dto.AdminNotificationResponse;
import org.springframework.stereotype.Service;
import com.finpilot.banking.dto.AdminChartResponse;
import com.finpilot.banking.dto.AdminUserDetailResponse;
import com.finpilot.banking.entity.Account;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;
import com.finpilot.banking.entity.User;
import com.finpilot.banking.entity.Account;

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

// ================= Notifications =================

public List<AdminNotificationResponse> getNotifications() {

    return transactionRepository
            .findTop10ByOrderByCreatedAtDesc()
            .stream()
            .map(transaction -> {

                AdminNotificationResponse dto =
                        new AdminNotificationResponse();

                dto.setId(transaction.getId());

                dto.setTime(
                        transaction.getCreatedAt()
                );

                dto.setMessage(

                        transaction.getTransactionType().name()

                                + " of ₹"

                                + transaction.getAmount()

                                + " completed"

                );

                return dto;

            })
            .toList();

}

// ================= Dashboard Chart =================

public List<AdminChartResponse> getChartData() {

    Map<String, Long> chart = new LinkedHashMap<>();

    for (int i = 6; i >= 0; i--) {

        LocalDate day = LocalDate.now().minusDays(i);

        chart.put(day.getDayOfWeek().name().substring(0, 3), 0L);
    }

    transactionRepository.findAll().forEach(transaction -> {

        LocalDate date = transaction
                .getCreatedAt()
                .toLocalDate();

        if (date.isAfter(LocalDate.now().minusDays(7))) {

            String key =
                    date.getDayOfWeek()
                            .name()
                            .substring(0, 3);

            chart.put(
                    key,
                    chart.get(key) + 1
            );

        }

    });

    return chart.entrySet()
            .stream()
            .map(entry ->
                    new AdminChartResponse(
                            entry.getKey(),
                            entry.getValue()
                    ))
            .toList();

}

// ================= All Transactions =================

public List<AdminTransactionResponse> getTransactions() {

    return transactionRepository
            .findAll()
            .stream()
            .sorted((a, b) ->
                    b.getCreatedAt().compareTo(a.getCreatedAt()))
            .map(transaction -> {

                AdminTransactionResponse dto =
                        new AdminTransactionResponse();

                dto.setId(transaction.getId());

                dto.setTransactionType(
                        transaction.getTransactionType().name()
                );

                dto.setAmount(
                        transaction.getAmount()
                );

                dto.setTransactionDate(
                        transaction.getCreatedAt()
                );

                return dto;

            })
            .toList();
}

public AdminUserDetailResponse getUserDetails(Long id) {

    var user = userRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    Account account = accountRepository
            .findByUser(user)
            .orElseThrow(() ->
                    new RuntimeException("Account not found"));

    AdminUserDetailResponse dto =
            new AdminUserDetailResponse();

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

    dto.setAccountNumber(
            account.getAccountNumber()
    );

    dto.setBalance(
            account.getBalance()
    );

    return dto;

}

public List<AdminTransactionResponse> getUserTransactions(Long userId) {

    User user = userRepository.findById(userId)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    Account account = accountRepository.findByUser(user)
            .orElseThrow(() ->
                    new RuntimeException("Account not found"));

    return transactionRepository
            .findByAccountIdOrderByCreatedAtDesc(account.getId())
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