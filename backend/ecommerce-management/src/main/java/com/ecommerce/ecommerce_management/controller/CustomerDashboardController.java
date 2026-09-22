package com.ecommerce.ecommerce_management.controller;

import com.ecommerce.ecommerce_management.dto.CustomerDashboardResponse;
import com.ecommerce.ecommerce_management.service.CustomerDashboardService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import com.ecommerce.ecommerce_management.dto.CustomerOrderStatusCountResponse;
import com.ecommerce.ecommerce_management.dto.MonthlySpendingResponse;

import java.util.List;

@RestController
@RequestMapping("/api/customer/dashboard")
public class CustomerDashboardController {

    private final CustomerDashboardService customerDashboardService;

    public CustomerDashboardController(
            CustomerDashboardService customerDashboardService) {

        this.customerDashboardService = customerDashboardService;
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping
    public ResponseEntity<CustomerDashboardResponse> getDashboard(
            Authentication authentication) {

        return ResponseEntity.ok(
                customerDashboardService.getDashboard(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/order-status")
    public ResponseEntity<List<CustomerOrderStatusCountResponse>> getOrderStatusCounts(
            Authentication authentication) {

        return ResponseEntity.ok(
                customerDashboardService.getOrderStatusCounts(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/monthly-spending")
    public ResponseEntity<List<MonthlySpendingResponse>> getMonthlySpending(
            Authentication authentication) {

        return ResponseEntity.ok(
                customerDashboardService.getMonthlySpending(
                        authentication.getName()
                )
        );
    }
}