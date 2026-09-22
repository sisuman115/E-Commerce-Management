package com.ecommerce.ecommerce_management.dto;

import java.math.BigDecimal;

public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private Integer lowStockThreshold;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
    private Double averageRating;
    private Long reviewCount;
    private Boolean isWishlisted;
    private Long wishlistCount;
    private Boolean isLowStock;

    public ProductResponse(
            Long id,
            String name,
            String description,
            BigDecimal price,
            Integer stock,
            String imageUrl,
            Long categoryId,
            String categoryName) {

        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.imageUrl = imageUrl;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
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

    public Integer getLowStockThreshold() {
        return lowStockThreshold;
    }

    public void setLowStockThreshold(Integer lowStockThreshold) {
        this.lowStockThreshold = lowStockThreshold;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Long getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Long reviewCount) {
        this.reviewCount = reviewCount;
    }

    public Boolean getIsWishlisted() {
        return isWishlisted;
    }

    public void setIsWishlisted(Boolean isWishlisted) {
        this.isWishlisted = isWishlisted;
    }

    public Long getWishlistCount() {
        return wishlistCount;
    }

    public void setWishlistCount(Long wishlistCount) {
        this.wishlistCount = wishlistCount;
    }

    public Boolean getIsLowStock() {
        return isLowStock;
    }

    public void setIsLowStock(Boolean isLowStock) {
        this.isLowStock = isLowStock;
    }
}