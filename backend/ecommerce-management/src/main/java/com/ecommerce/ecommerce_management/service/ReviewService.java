package com.ecommerce.ecommerce_management.service;

import com.ecommerce.ecommerce_management.dto.ReviewRequest;
import com.ecommerce.ecommerce_management.dto.ReviewResponse;
import com.ecommerce.ecommerce_management.entity.Product;
import com.ecommerce.ecommerce_management.entity.Review;
import com.ecommerce.ecommerce_management.entity.User;
import com.ecommerce.ecommerce_management.exception.ResourceNotFoundException;
import com.ecommerce.ecommerce_management.repository.OrderItemRepository;
import com.ecommerce.ecommerce_management.repository.ProductRepository;
import com.ecommerce.ecommerce_management.repository.ReviewRepository;
import com.ecommerce.ecommerce_management.repository.UserRepository;
import com.ecommerce.ecommerce_management.dto.RatingDistributionResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private final OrderItemRepository orderItemRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            OrderItemRepository orderItemRepository) {

        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public ReviewResponse addReview(
            String email,
            ReviewRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!orderItemRepository.existsByOrderUserIdAndProductId(
                user.getId(),
                product.getId())) {

            throw new RuntimeException("You can review only products you have purchased");
        }

        if (reviewRepository.existsByUserIdAndProductId(
                user.getId(),
                product.getId())) {

            throw new RuntimeException(
                    "You have already reviewed this product"
            );
        }

        Review review = new Review();

        review.setUser(user);
        review.setProduct(product);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review savedReview = reviewRepository.save(review);

        return mapToResponse(savedReview);
    }

    public ReviewResponse updateReview(
            String email,
            Long reviewId,
            ReviewRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Review review = reviewRepository.findByIdAndUserId(
                reviewId,
                user.getId()
        ).orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review updatedReview = reviewRepository.save(review);

        return mapToResponse(updatedReview);
    }

    public void deleteReview(String email, Long reviewId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Review review = reviewRepository.findByIdAndUserId(
                reviewId,
                user.getId()
        ).orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        reviewRepository.delete(review);
    }

    public List<ReviewResponse> getProductReviews(Long productId) {

        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found");
        }

        return reviewRepository.findByProductId(productId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public Double getAverageRating(Long productId) {

        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found");
        }

        Double averageRating = reviewRepository.getAverageRatingByProductId(productId);

        return averageRating != null ? averageRating : 0.0;
    }

    public Long getReviewCount(Long productId) {

        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found");
        }

        return reviewRepository.countByProductId(productId);
    }

    public List<RatingDistributionResponse> getRatingDistribution(Long productId) {

        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found");
        }

        return reviewRepository
                .getRatingDistributionByProductId(productId)
                .stream()
                .map(row -> new RatingDistributionResponse(
                        ((Number) row[0]).intValue(),
                        ((Number) row[1]).longValue()
                ))
                .toList();
    }

    private ReviewResponse mapToResponse(Review review) {

        return new ReviewResponse(
                review.getId(),
                review.getProduct().getId(),
                review.getProduct().getName(),
                review.getUser().getId(),
                review.getUser().getName(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}