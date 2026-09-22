package com.ecommerce.ecommerce_management.repository;

import com.ecommerce.ecommerce_management.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByNameContainingIgnoreCase(String name);

    boolean existsByCategoryId(Long categoryId);

    long countByCategoryId(Long categoryId);

    @Query("""
        SELECT p
        FROM Product p
        WHERE p.lowStockThreshold IS NOT NULL
        AND p.stock <= p.lowStockThreshold
        """)
    List<Product> findLowStockProducts();
}