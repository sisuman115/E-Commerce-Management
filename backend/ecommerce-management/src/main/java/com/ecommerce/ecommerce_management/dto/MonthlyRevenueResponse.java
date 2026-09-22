package com.ecommerce.ecommerce_management.dto;

import java.math.BigDecimal;

public class MonthlyRevenueResponse {

    private int year;
    private int month;
    private BigDecimal revenue;

    public MonthlyRevenueResponse(
            int year,
            int month,
            BigDecimal revenue) {

        this.year = year;
        this.month = month;
        this.revenue = revenue;
    }

    public int getYear() {
        return year;
    }

    public int getMonth() {
        return month;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }
}