package com.ecommerce.ecommerce_management.dto;

import java.math.BigDecimal;

public class MonthlySpendingResponse {

    private int year;
    private int month;
    private BigDecimal amount;

    public MonthlySpendingResponse(
            int year,
            int month,
            BigDecimal amount) {

        this.year = year;
        this.month = month;
        this.amount = amount;
    }

    public int getYear() {
        return year;
    }

    public int getMonth() {
        return month;
    }

    public BigDecimal getAmount() {
        return amount;
    }
}