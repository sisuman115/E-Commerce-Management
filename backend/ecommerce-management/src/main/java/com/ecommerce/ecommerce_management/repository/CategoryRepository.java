package com.ecommerce.ecommerce_management.repository;

import com.ecommerce.ecommerce_management.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByName(String name);

    @Query("""
        SELECT c.id, c.name, COUNT(p)
        FROM Category c
        LEFT JOIN Product p ON p.category.id = c.id
        GROUP BY c.id, c.name
        ORDER BY c.id
        """)
    List<Object[]> getCategoryProductCounts();
}