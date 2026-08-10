package com.finpilot.banking.service;

import com.finpilot.banking.dto.DashboardResponse;
import com.finpilot.banking.entity.Account;
import com.finpilot.banking.entity.User;

import java.math.BigDecimal;

public interface AccountService {


    Account getAccount(Long id, User user);

    BigDecimal getBalance(Long id, User user);

    DashboardResponse getDashboard(User user);
}
