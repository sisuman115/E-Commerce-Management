package com.ecommerce.ecommerce_management.dto;

public class CategoryResponse {

    private Long id;
    private String name;
    private Long productCount;

    public CategoryResponse(Long id, String name, Long productCount) {
        this.id = id;
        this.name = name;
        this.productCount = productCount;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Long getProductCount() {
        return productCount;
    }
}