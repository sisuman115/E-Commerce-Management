package com.ecommerce.ecommerce_management.repository;

import com.ecommerce.ecommerce_management.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {

    List<WishlistItem> findByWishlistId(Long wishlistId);

    Optional<WishlistItem> findByWishlistIdAndProductId(
            Long wishlistId,
            Long productId
    );

    long countByProductId(Long productId);

    void deleteByProductId(Long productId);

    @Query("""
        SELECT COUNT(wi)
        FROM WishlistItem wi
        WHERE wi.wishlist.user.id = :userId
        """)
    long countByUserId(@Param("userId") Long userId);
}