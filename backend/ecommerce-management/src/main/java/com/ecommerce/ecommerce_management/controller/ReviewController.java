package com.ecommerce.ecommerce_management.controller;

import com.ecommerce.ecommerce_management.dto.RatingDistributionResponse;
import com.ecommerce.ecommerce_management.dto.ReviewRequest;
import com.ecommerce.ecommerce_management.dto.ReviewResponse;
import com.ecommerce.ecommerce_management.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        ReviewResponse response =
                reviewService.addReview(email, request);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        ReviewResponse response = reviewService.updateReview(
                email,
                reviewId,
                request
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(
            @PathVariable Long reviewId,
            Authentication authentication) {

        String email = authentication.getName();

        reviewService.deleteReview(email, reviewId);

        return ResponseEntity.ok("Review deleted successfully");
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getProductReviews(
            @PathVariable Long productId) {

        List<ReviewResponse> reviews =
                reviewService.getProductReviews(productId);

        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/product/{productId}/average")
    public ResponseEntity<Double> getAverageRating(
            @PathVariable Long productId) {

        Double averageRating = reviewService.getAverageRating(productId);

        return ResponseEntity.ok(averageRating);
    }

    @GetMapping("/product/{productId}/count")
    public ResponseEntity<Long> getReviewCount(
            @PathVariable Long productId) {

        Long reviewCount = reviewService.getReviewCount(productId);

        return ResponseEntity.ok(reviewCount);
    }

    @GetMapping("/product/{productId}/distribution")
    public ResponseEntity<List<RatingDistributionResponse>> getRatingDistribution(
            @PathVariable Long productId) {

        List<RatingDistributionResponse> distribution =
                reviewService.getRatingDistribution(productId);

        return ResponseEntity.ok(distribution);
    }
}