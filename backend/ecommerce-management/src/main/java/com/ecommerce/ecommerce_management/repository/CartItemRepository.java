package com.ecommerce.ecommerce_management.repository;

import com.ecommerce.ecommerce_management.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCartIdAndProductId(
            Long cartId,
            Long productId
    );

    List<CartItem> findByCartId(Long cartId);

    boolean existsByCartId(Long cartId);

    void deleteByProductId(Long productId);
}