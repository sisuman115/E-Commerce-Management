package com.ecommerce.ecommerce_management.dto;

import java.math.BigDecimal;

public class AdminDashboardResponse {

    private long totalUsers;
    private long totalProducts;
    private long totalCategories;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long pendingOrders;
    private long lowStockProducts;

    public AdminDashboardResponse(
            long totalUsers,
            long totalProducts,
            long totalCategories,
            long totalOrders,
            BigDecimal totalRevenue,
            long pendingOrders,
            long lowStockProducts) {

        this.totalUsers = totalUsers;
        this.totalProducts = totalProducts;
        this.totalCategories = totalCategories;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.pendingOrders = pendingOrders;
        this.lowStockProducts = lowStockProducts;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public long getTotalCategories() {
        return totalCategories;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public long getLowStockProducts() {
        return lowStockProducts;
    }
}