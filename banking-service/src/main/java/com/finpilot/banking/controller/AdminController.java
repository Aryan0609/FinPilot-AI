package com.finpilot.banking.controller;
import com.finpilot.banking.dto.AdminUserDetailResponse;
import com.finpilot.banking.dto.AdminDashboardResponse;
import com.finpilot.banking.dto.AdminTransactionResponse;
import com.finpilot.banking.dto.AdminUserResponse;
import com.finpilot.banking.service.AdminService;
import com.finpilot.banking.dto.AdminNotificationResponse;
import org.springframework.web.bind.annotation.*;
import com.finpilot.banking.dto.AdminChartResponse;
import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }



    @GetMapping("/dashboard")
    public AdminDashboardResponse dashboard() {
        return adminService.getDashboard();
    }

  

    @GetMapping("/users")
    public List<AdminUserResponse> getUsers() {
        return adminService.getUsers();
    }

    @GetMapping("/users/recent")
    public List<AdminUserResponse> getRecentUsers() {
        return adminService.getRecentUsers();
    }


    @GetMapping("/transactions")
    public List<AdminTransactionResponse> getTransactions() {
        return adminService.getTransactions();
    }

    @GetMapping("/transactions/recent")
    public List<AdminTransactionResponse> getRecentTransactions() {
        return adminService.getRecentTransactions();
    }

    @GetMapping("/notifications")
    public List<AdminNotificationResponse> getNotifications() {

    return adminService.getNotifications();

}

@GetMapping("/dashboard/chart")
public List<AdminChartResponse> getChartData() {

    return adminService.getChartData();

}

@GetMapping("/users/{id}")
public AdminUserDetailResponse getUserDetails(
        @PathVariable Long id) {

    return adminService.getUserDetails(id);

}

@GetMapping("/users/{id}/transactions")
public List<AdminTransactionResponse> getUserTransactions(
        @PathVariable Long id) {

    return adminService.getUserTransactions(id);

}

}