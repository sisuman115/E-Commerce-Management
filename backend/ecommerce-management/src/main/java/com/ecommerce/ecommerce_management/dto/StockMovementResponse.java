package com.ecommerce.ecommerce_management.dto;

import java.time.LocalDateTime;

public class StockMovementResponse {

    private Long id;
    private Long productId;
    private String productName;
    private Integer previousStock;
    private Integer newStock;
    private String reason;
    private LocalDateTime createdAt;

    public StockMovementResponse(
            Long id,
            Long productId,
            String productName,
            Integer previousStock,
            Integer newStock,
            String reason,
            LocalDateTime createdAt) {

        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.previousStock = previousStock;
        this.newStock = newStock;
        this.reason = reason;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public Integer getPreviousStock() {
        return previousStock;
    }

    public Integer getNewStock() {
        return newStock;
    }

    public String getReason() {
        return reason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}