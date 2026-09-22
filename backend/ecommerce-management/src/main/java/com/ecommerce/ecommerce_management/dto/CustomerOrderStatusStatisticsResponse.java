package com.ecommerce.ecommerce_management.dto;

import com.ecommerce.ecommerce_management.entity.OrderStatus;

public class CustomerOrderStatusStatisticsResponse {

    private Long userId;
    private String userName;
    private String email;
    private OrderStatus status;
    private Long orderCount;

    public CustomerOrderStatusStatisticsResponse(
            Long userId,
            String userName,
            String email,
            OrderStatus status,
            Long orderCount) {

        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.status = status;
        this.orderCount = orderCount;
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

    public OrderStatus getStatus() {
        return status;
    }

    public Long getOrderCount() {
        return orderCount;
    }
}