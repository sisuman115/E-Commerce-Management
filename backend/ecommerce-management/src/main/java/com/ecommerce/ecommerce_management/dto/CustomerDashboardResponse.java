package com.ecommerce.ecommerce_management.dto;

import java.math.BigDecimal;

public class CustomerDashboardResponse {

    private long totalOrders;
    private BigDecimal totalSpent;
    private long activeOrders;
    private long wishlistItems;

    public CustomerDashboardResponse(
            long totalOrders,
            BigDecimal totalSpent,
            long activeOrders,
            long wishlistItems) {

        this.totalOrders = totalOrders;
        this.totalSpent = totalSpent;
        this.activeOrders = activeOrders;
        this.wishlistItems = wishlistItems;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public BigDecimal getTotalSpent() {
        return totalSpent;
    }

    public long getActiveOrders() {
        return activeOrders;
    }

    public long getWishlistItems() {
        return wishlistItems;
    }
}