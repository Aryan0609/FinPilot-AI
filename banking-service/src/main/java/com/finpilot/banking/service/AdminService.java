package com.finpilot.banking.service;

import com.finpilot.banking.dto.AdminChartResponse;
import com.finpilot.banking.dto.AdminDashboardResponse;
import com.finpilot.banking.dto.AdminNotificationResponse;
import com.finpilot.banking.dto.AdminTransactionResponse;
import com.finpilot.banking.dto.AdminUserDetailResponse;
import com.finpilot.banking.dto.AdminUserResponse;
import com.finpilot.banking.entity.Account;
import com.finpilot.banking.entity.Investment;
import com.finpilot.banking.entity.Role;
import com.finpilot.banking.entity.User;
import com.finpilot.banking.repository.AccountRepository;
import com.finpilot.banking.repository.InvestmentRepository;
import com.finpilot.banking.repository.MutualFundRepository;
import com.finpilot.banking.repository.TransactionRepository;
import com.finpilot.banking.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {



    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final MutualFundRepository mutualFundRepository;
    private final InvestmentRepository investmentRepository;

    public AdminService(
        UserRepository userRepository,
        TransactionRepository transactionRepository,
        AccountRepository accountRepository,
        MutualFundRepository mutualFundRepository,
        InvestmentRepository investmentRepository) {

    this.userRepository = userRepository;
    this.transactionRepository = transactionRepository;
    this.accountRepository = accountRepository;
    this.mutualFundRepository = mutualFundRepository;
    this.investmentRepository = investmentRepository;
}

    // =========================================================
    // MUTUAL FUNDS
    // =========================================================

    // =========================================================
// MUTUAL FUNDS
// =========================================================

public List<Map<String, Object>> getMutualFunds() {

    return mutualFundRepository.findAll()
            .stream()
            .map(fund -> {

                Map<String, Object> dto = new LinkedHashMap<>();

                dto.put("id", fund.getId());
                dto.put("fundName", fund.getFundName());
                dto.put("fundType", fund.getFundType());
                dto.put("nav", fund.getNav());
                dto.put("riskLevel", fund.getRiskLevel());
                dto.put("annualReturn", fund.getAnnualReturn());
                dto.put("createdAt", fund.getCreatedAt());

                // =====================================================
                // TOTAL UNITS SOLD
                // =====================================================

                BigDecimal totalUnits = fund.getInvestments()
                        .stream()
                        .map(Investment::getUnitsPurchased)
                        .filter(units -> units != null)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

                dto.put("totalUnits", totalUnits);

                // Keep this too for backward compatibility
                dto.put("unitsSold", totalUnits);

                // =====================================================
                // UNIQUE INVESTORS
                //
                // Same user buying multiple times = 1 investor
                // =====================================================

                long investorCount = fund.getInvestments()
                        .stream()
                        .map(investment ->
                                investment.getAccount()
                                        .getUser()
                                        .getId()
                        )
                        .distinct()
                        .count();

                dto.put("investorCount", investorCount);

                // Keep this too for backward compatibility
                dto.put("investors", investorCount);

                // =====================================================
                // TOTAL CURRENT VALUE
                //
                // units × current NAV
                // =====================================================

                BigDecimal totalCurrentValue =
                        fund.getInvestments()
                                .stream()
                                .map(investment -> {

                                    BigDecimal units =
                                            investment.getUnitsPurchased();

                                    if (units == null ||
                                            fund.getNav() == null) {
                                        return BigDecimal.ZERO;
                                    }

                                    return units.multiply(
                                            fund.getNav()
                                    );
                                })
                                .reduce(
                                        BigDecimal.ZERO,
                                        BigDecimal::add
                                );

                dto.put(
                        "totalCurrentValue",
                        totalCurrentValue
                );

                // =====================================================
                // TOTAL ORIGINAL INVESTMENT
                // =====================================================

                BigDecimal totalInvestment =
                        fund.getInvestments()
                                .stream()
                                .map(Investment::getInvestmentAmount)
                                .filter(amount -> amount != null)
                                .reduce(
                                        BigDecimal.ZERO,
                                        BigDecimal::add
                                );

                dto.put(
                        "totalInvestment",
                        totalInvestment
                );

                // =====================================================
                // PROFIT / LOSS
                // =====================================================

                BigDecimal profitLoss =
                        totalCurrentValue.subtract(
                                totalInvestment
                        );

                dto.put(
                        "profitLoss",
                        profitLoss
                );

                // =====================================================
                // RETURN %
                // =====================================================

                BigDecimal returnPercentage =
                        BigDecimal.ZERO;

                if (totalInvestment.compareTo(
                        BigDecimal.ZERO) > 0) {

                    returnPercentage =
                            profitLoss
                                    .multiply(
                                            BigDecimal.valueOf(100)
                                    )
                                    .divide(
                                            totalInvestment,
                                            2,
                                            java.math.RoundingMode.HALF_UP
                                    );
                }

                dto.put(
                        "returnPercentage",
                        returnPercentage
                );

                return dto;

            })
            .toList();
}
                // =========================================================
// MUTUAL FUND INVESTMENTS / TRANSACTIONS
// =========================================================

public List<Map<String, Object>> getMutualFundInvestments(
        Long fundId) {

    return investmentRepository
            .findByMutualFundIdOrderByInvestmentDateDesc(fundId)
            .stream()
            .map(investment -> {

                Map<String, Object> dto =
                        new LinkedHashMap<>();

                Account account =
                        investment.getAccount();

                User user =
                        account.getUser();

                BigDecimal currentValue =
                        investment.getCurrentValue();

                BigDecimal profitLoss =
                        investment.getProfitLoss();

                BigDecimal investmentAmount =
                        investment.getInvestmentAmount();

                BigDecimal returnPercentage =
                        BigDecimal.ZERO;

                if (investmentAmount != null
                        && investmentAmount.compareTo(
                                BigDecimal.ZERO
                        ) > 0) {

                    returnPercentage =
                            profitLoss
                                    .multiply(
                                            BigDecimal.valueOf(100)
                                    )
                                    .divide(
                                            investmentAmount,
                                            2,
                                            java.math.RoundingMode.HALF_UP
                                    );
                }

                dto.put(
                        "investmentId",
                        investment.getId()
                );

                dto.put(
                        "userId",
                        user.getId()
                );

                dto.put(
                        "userName",
                        user.getName()
                );

                dto.put(
                        "accountId",
                        account.getId()
                );

                dto.put(
                        "units",
                        investment.getUnitsPurchased()
                );

                dto.put(
                        "purchaseNav",
                        investment.getPurchaseNav()
                );

                dto.put(
                        "investmentAmount",
                        investmentAmount
                );

                dto.put(
                        "currentNav",
                        investment
                                .getMutualFund()
                                .getNav()
                );

                dto.put(
                        "currentValue",
                        currentValue
                );

                dto.put(
                        "profitLoss",
                        profitLoss
                );

                dto.put(
                        "returnPercentage",
                        returnPercentage
                );

                dto.put(
                        "investmentDate",
                        investment.getInvestmentDate()
                );

                return dto;

            })
            .toList();
}

    // =========================================================
    // RECENT USERS
    // =========================================================

    public List<AdminUserResponse> getRecentUsers() {

        return userRepository
                .findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(user -> {

                    AdminUserResponse dto =
                            new AdminUserResponse();

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

    // =========================================================
    // DASHBOARD
    // =========================================================

    public AdminDashboardResponse getDashboard() {

        AdminDashboardResponse response =
                new AdminDashboardResponse();

        response.setTotalUsers(
                userRepository.count()
        );

        response.setTotalTransactions(
                transactionRepository.count()
        );

        response.setTotalWalletBalance(
                accountRepository.getTotalWalletBalance()
        );

        /*
         * Fraud alerts can be connected to the AI/fraud
         * table later.
         */
        response.setFraudAlerts(0);

        response.setAiStatus("ONLINE");

        return response;
    }

    // =========================================================
    // ALL USERS
    // =========================================================

    public List<AdminUserResponse> getUsers() {

        return userRepository
                .findAll()
                .stream()
                .map(user -> {

                    AdminUserResponse dto =
                            new AdminUserResponse();

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

    // =========================================================
    // RECENT TRANSACTIONS
    // =========================================================

    public List<AdminTransactionResponse> getRecentTransactions() {

        return transactionRepository
                .findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(transaction -> {

                    AdminTransactionResponse dto =
                            new AdminTransactionResponse();

                    dto.setId(transaction.getId());

                    dto.setTransactionType(
                            transaction
                                    .getTransactionType()
                                    .name()
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

    // =========================================================
    // NOTIFICATIONS
    // =========================================================

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
                            transaction
                                    .getTransactionType()
                                    .name()
                                    + " of ₹"
                                    + transaction.getAmount()
                                    + " completed"
                    );

                    return dto;
                })
                .toList();
    }

    // =========================================================
    // DASHBOARD CHART
    // =========================================================

    public List<AdminChartResponse> getChartData() {

        Map<String, Long> chart =
                new LinkedHashMap<>();

        for (int i = 6; i >= 0; i--) {

            LocalDate day =
                    LocalDate.now().minusDays(i);

            chart.put(
                    day.getDayOfWeek()
                            .name()
                            .substring(0, 3),
                    0L
            );
        }

        transactionRepository
                .findAll()
                .forEach(transaction -> {

                    LocalDate date =
                            transaction
                                    .getCreatedAt()
                                    .toLocalDate();

                    if (date.isAfter(
                            LocalDate.now().minusDays(7))) {

                        String key =
                                date.getDayOfWeek()
                                        .name()
                                        .substring(0, 3);

                        chart.put(
                                key,
                                chart.getOrDefault(key, 0L) + 1
                        );
                    }
                });

        return chart.entrySet()
                .stream()
                .map(entry ->
                        new AdminChartResponse(
                                entry.getKey(),
                                entry.getValue()
                        )
                )
                .toList();
    }

    // =========================================================
    // ALL TRANSACTIONS
    // =========================================================

    public List<AdminTransactionResponse> getTransactions() {

        return transactionRepository
                .findAll()
                .stream()
                .sorted(
                        (a, b) ->
                                b.getCreatedAt()
                                        .compareTo(
                                                a.getCreatedAt()
                                        )
                )
                .map(transaction -> {

                    AdminTransactionResponse dto =
                            new AdminTransactionResponse();

                    dto.setId(transaction.getId());

                    dto.setTransactionType(
                            transaction
                                    .getTransactionType()
                                    .name()
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

    // =========================================================
    // USER DETAILS
    // =========================================================

    public AdminUserDetailResponse getUserDetails(
            Long id) {

        User user =
                userRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        Account account =
                accountRepository
                        .findByUser(user)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Account not found"
                                )
                        );

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

    // =========================================================
    // USER TRANSACTIONS
    // =========================================================

    public List<AdminTransactionResponse> getUserTransactions(
            Long userId) {

        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        Account account =
                accountRepository
                        .findByUser(user)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Account not found"
                                )
                        );

        return transactionRepository
                .findByAccountIdOrderByCreatedAtDesc(
                        account.getId()
                )
                .stream()
                .map(transaction -> {

                    AdminTransactionResponse dto =
                            new AdminTransactionResponse();

                    dto.setId(
                            transaction.getId()
                    );

                    dto.setTransactionType(
                            transaction
                                    .getTransactionType()
                                    .name()
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
}