package com.ecommerce.ecommerce_management.dto;

public class RatingDistributionResponse {

    private Integer rating;
    private Long count;

    public RatingDistributionResponse() {
    }

    public RatingDistributionResponse(Integer rating, Long count) {
        this.rating = rating;
        this.count = count;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}