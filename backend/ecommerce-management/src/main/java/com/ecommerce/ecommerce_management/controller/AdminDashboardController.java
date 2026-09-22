package com.ecommerce.ecommerce_management.controller;

import com.ecommerce.ecommerce_management.dto.AdminDashboardResponse;
import com.ecommerce.ecommerce_management.service.AdminDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ecommerce.ecommerce_management.dto.OrderStatusCountResponse;
import java.util.List;
import com.ecommerce.ecommerce_management.dto.OrderStatusRevenueResponse;
import com.ecommerce.ecommerce_management.dto.UserRoleCountResponse;
import com.ecommerce.ecommerce_management.dto.CategoryProductCountResponse;
import com.ecommerce.ecommerce_management.dto.ProductSalesResponse;
import com.ecommerce.ecommerce_management.dto.MonthlyRevenueResponse;
import com.ecommerce.ecommerce_management.dto.ProductRevenueResponse;
import com.ecommerce.ecommerce_management.dto.CustomerSpendingResponse;
import com.ecommerce.ecommerce_management.dto.CustomerOrderStatisticsResponse;
import com.ecommerce.ecommerce_management.dto.CustomerOrderStatusStatisticsResponse;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    public AdminDashboardController(
            AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(
                adminDashboardService.getDashboard()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/order-status")
    public ResponseEntity<List<OrderStatusCountResponse>> getOrderStatusCounts() {

        return ResponseEntity.ok(
                adminDashboardService.getOrderStatusCounts()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/order-status-revenue")
    public ResponseEntity<List<OrderStatusRevenueResponse>> getOrderStatusRevenue() {

        return ResponseEntity.ok(
                adminDashboardService.getOrderStatusRevenue()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user-roles")
    public ResponseEntity<List<UserRoleCountResponse>> getUserRoleCounts() {

        return ResponseEntity.ok(
                adminDashboardService.getUserRoleCounts()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/category-products")
    public ResponseEntity<List<CategoryProductCountResponse>> getCategoryProductCounts() {

        return ResponseEntity.ok(
                adminDashboardService.getCategoryProductCounts()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/product-sales")
    public ResponseEntity<List<ProductSalesResponse>> getProductSales() {

        return ResponseEntity.ok(
                adminDashboardService.getProductSales()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/monthly-revenue")
    public ResponseEntity<List<MonthlyRevenueResponse>> getMonthlyRevenue() {

        return ResponseEntity.ok(
                adminDashboardService.getMonthlyRevenue()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/product-revenue")
    public ResponseEntity<List<ProductRevenueResponse>> getProductRevenue() {

        return ResponseEntity.ok(
                adminDashboardService.getProductRevenue()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/customer-spending")
    public ResponseEntity<List<CustomerSpendingResponse>> getCustomerSpending() {

        return ResponseEntity.ok(
                adminDashboardService.getCustomerSpending()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/customer-order-statistics")
    public ResponseEntity<List<CustomerOrderStatisticsResponse>> getCustomerOrderStatistics() {

        return ResponseEntity.ok(
                adminDashboardService.getCustomerOrderStatistics()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/customer-order-status-statistics")
    public ResponseEntity<List<CustomerOrderStatusStatisticsResponse>> getCustomerOrderStatusStatistics() {

        return ResponseEntity.ok(
                adminDashboardService.getCustomerOrderStatusStatistics()
        );
    }
}