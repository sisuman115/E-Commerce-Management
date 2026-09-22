package com.ecommerce.ecommerce_management.dto;

public class CustomerOrderStatisticsResponse {

    private Long userId;
    private String userName;
    private String email;
    private Long totalOrders;
    private Long activeOrders;

    public CustomerOrderStatisticsResponse(
            Long userId,
            String userName,
            String email,
            Long totalOrders,
            Long activeOrders) {

        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.totalOrders = totalOrders;
        this.activeOrders = activeOrders;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public String getEmail() {
        return email;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public Long getActiveOrders() {
        return activeOrders;
    }
}