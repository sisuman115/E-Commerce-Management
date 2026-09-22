package com.ecommerce.ecommerce_management.dto;

public class CategoryProductCountResponse {

    private Long categoryId;
    private String categoryName;
    private long productCount;

    public CategoryProductCountResponse(
            Long categoryId,
            String categoryName,
            long productCount) {

        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.productCount = productCount;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public long getProductCount() {
        return productCount;
    }
}