package com.ecommerce.ecommerce_management.repository;

import com.ecommerce.ecommerce_management.entity.OrderItem;
import com.ecommerce.ecommerce_management.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);

    boolean existsByOrderUserIdAndProductId(Long userId, Long productId);

    boolean existsByProductId(Long productId);

    @Query("""
        SELECT oi.product.id, oi.product.name, SUM(oi.quantity)
        FROM OrderItem oi
        GROUP BY oi.product.id, oi.product.name
        ORDER BY SUM(oi.quantity) DESC
        """)
    List<Object[]> getProductSales();

    @Query("""
        SELECT oi.product.id,
               oi.product.name,
               COALESCE(SUM(oi.price * oi.quantity), 0)
        FROM OrderItem oi
        JOIN oi.order o
        WHERE o.status <> :cancelledStatus
        GROUP BY oi.product.id, oi.product.name
        ORDER BY SUM(oi.price * oi.quantity) DESC
        """)
    List<Object[]> getProductRevenue(
            @Param("cancelledStatus") OrderStatus cancelledStatus);
}