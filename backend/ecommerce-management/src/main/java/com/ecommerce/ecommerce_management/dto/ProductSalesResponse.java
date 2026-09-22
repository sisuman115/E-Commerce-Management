package com.ecommerce.ecommerce_management.dto;

public class ProductSalesResponse {

    private Long productId;
    private String productName;
    private long quantitySold;

    public ProductSalesResponse(
            Long productId,
            String productName,
            long quantitySold) {

        this.productId = productId;
        this.productName = productName;
        this.quantitySold = quantitySold;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public long getQuantitySold() {
        return quantitySold;
    }
}