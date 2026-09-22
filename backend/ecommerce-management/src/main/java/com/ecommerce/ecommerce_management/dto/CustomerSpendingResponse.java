package com.ecommerce.ecommerce_management.dto;

import java.math.BigDecimal;

public class CustomerSpendingResponse {

    private Long userId;
    private String userName;
    private String email;
    private BigDecimal totalSpent;

    public CustomerSpendingResponse(
            Long userId,
            String userName,
            String email,
            BigDecimal totalSpent) {

        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.totalSpent = totalSpent;
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

    public BigDecimal getTotalSpent() {
        return totalSpent;
    }
}