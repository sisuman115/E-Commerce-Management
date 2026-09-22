package com.ecommerce.ecommerce_management.dto;

import com.ecommerce.ecommerce_management.entity.OrderStatus;

public class OrderStatusCountResponse {

    private OrderStatus status;
    private long count;

    public OrderStatusCountResponse(
            OrderStatus status,
            long count) {

        this.status = status;
        this.count = count;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public long getCount() {
        return count;
    }
}