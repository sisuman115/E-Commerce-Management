package com.ecommerce.ecommerce_management.repository;

import com.ecommerce.ecommerce_management.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductId(Long productId);

    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    Optional<Review> findByIdAndUserId(Long reviewId, Long userId);

    boolean existsByIdAndUserId(Long reviewId, Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(@Param("productId") Long productId);

    long countByProductId(Long productId);

    @Query("""
        SELECT r.rating, COUNT(r)
        FROM Review r
        WHERE r.product.id = :productId
        GROUP BY r.rating
        ORDER BY r.rating DESC
    """)
    List<Object[]> getRatingDistributionByProductId(
            @Param("productId") Long productId);
}