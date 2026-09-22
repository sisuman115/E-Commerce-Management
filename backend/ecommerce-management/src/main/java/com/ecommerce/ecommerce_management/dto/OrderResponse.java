package com.ecommerce.ecommerce_management.dto;

import com.ecommerce.ecommerce_management.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {

    private Long orderId;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDateTime orderDate;
    private List<OrderItemResponse> items;

    private String shippingFullName;
    private String shippingPhone;
    private String shippingAddressLine;
    private String shippingCity;
    private String shippingState;
    private String shippingPincode;

    public OrderResponse(
            Long orderId,
            BigDecimal totalAmount,
            OrderStatus status,
            LocalDateTime orderDate,
            String shippingFullName,
            String shippingPhone,
            String shippingAddressLine,
            String shippingCity,
            String shippingState,
            String shippingPincode,
            List<OrderItemResponse> items) {

        this.orderId = orderId;
        this.totalAmount = totalAmount;
        this.status = status;
        this.orderDate = orderDate;
        this.shippingFullName = shippingFullName;
        this.shippingPhone = shippingPhone;
        this.shippingAddressLine = shippingAddressLine;
        this.shippingCity = shippingCity;
        this.shippingState = shippingState;
        this.shippingPincode = shippingPincode;
        this.items = items;
    }

    public Long getOrderId() {
        return orderId;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public String getShippingFullName() {
        return shippingFullName;
    }

    public String getShippingPhone() {
        return shippingPhone;
    }

    public String getShippingAddressLine() {
        return shippingAddressLine;
    }

    public String getShippingCity() {
        return shippingCity;
    }

    public String getShippingState() {
        return shippingState;
    }

    public String getShippingPincode() {
        return shippingPincode;
    }
}