package com.finpilot.banking.controller;

import com.finpilot.banking.dto.AdminDashboardResponse;
import com.finpilot.banking.dto.AdminTransactionResponse;
import com.finpilot.banking.dto.AdminUserResponse;
import com.finpilot.banking.service.AdminService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ================= Dashboard =================

    @GetMapping("/dashboard")
    public AdminDashboardResponse dashboard() {
        return adminService.getDashboard();
    }

    // ================= Users =================

    @GetMapping("/users")
    public List<AdminUserResponse> getUsers() {
        return adminService.getUsers();
    }

    // ================= Recent Transactions =================

    @GetMapping("/transactions/recent")
    public List<AdminTransactionResponse> getRecentTransactions() {
        return adminService.getRecentTransactions();
    }

    @GetMapping("/users/recent")
    public List<AdminUserResponse> getRecentUsers() {
        return adminService.getRecentUsers();
}

}