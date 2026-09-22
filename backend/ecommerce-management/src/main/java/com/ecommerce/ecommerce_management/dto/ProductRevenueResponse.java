package com.ecommerce.ecommerce_management.dto;

import java.math.BigDecimal;

public class ProductRevenueResponse {

    private Long productId;
    private String productName;
    private BigDecimal revenue;

    public ProductRevenueResponse(
            Long productId,
            String productName,
            BigDecimal revenue) {

        this.productId = productId;
        this.productName = productName;
        this.revenue = revenue;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }
}