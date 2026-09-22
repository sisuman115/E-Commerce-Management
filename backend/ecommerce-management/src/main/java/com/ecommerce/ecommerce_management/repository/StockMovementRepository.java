package com.ecommerce.ecommerce_management.repository;

import com.ecommerce.ecommerce_management.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockMovementRepository
        extends JpaRepository<StockMovement, Long> {

    List<StockMovement> findByProductIdOrderByCreatedAtDesc(Long productId);

    void deleteByProductId(Long productId);
}