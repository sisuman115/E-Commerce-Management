package com.ecommerce.ecommerce_management.dto;

import java.math.BigDecimal;

public class WishlistItemResponse {

    private Long wishlistItemId;
    private Long productId;
    private String productName;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;

    public WishlistItemResponse() {
    }

    public WishlistItemResponse(
            Long wishlistItemId,
            Long productId,
            String productName,
            String description,
            BigDecimal price,
            Integer stock,
            String imageUrl,
            Long categoryId,
            String categoryName) {

        this.wishlistItemId = wishlistItemId;
        this.productId = productId;
        this.productName = productName;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.imageUrl = imageUrl;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    public Long getWishlistItemId() {
        return wishlistItemId;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Integer getStock() {
        return stock;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }
}