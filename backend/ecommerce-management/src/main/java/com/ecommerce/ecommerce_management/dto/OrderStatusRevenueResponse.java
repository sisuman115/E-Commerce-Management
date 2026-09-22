package com.ecommerce.ecommerce_management.dto;

import com.ecommerce.ecommerce_management.entity.OrderStatus;

import java.math.BigDecimal;

public class OrderStatusRevenueResponse {

    private OrderStatus status;
    private BigDecimal revenue;

    public OrderStatusRevenueResponse(OrderStatus status, BigDecimal revenue) {
        this.status = status;
        this.revenue = revenue;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }
}