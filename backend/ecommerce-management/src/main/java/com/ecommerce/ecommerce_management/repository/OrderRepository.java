package com.ecommerce.ecommerce_management.repository;

import com.ecommerce.ecommerce_management.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ecommerce.ecommerce_management.entity.OrderStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    @Query("""
        SELECT COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        WHERE o.status <> :cancelledStatus
        """)
    BigDecimal getTotalRevenue(
            @Param("cancelledStatus") OrderStatus cancelledStatus
    );

    long countByStatus(OrderStatus status);

    @Query("""
        SELECT o.status, COUNT(o)
        FROM Order o
        GROUP BY o.status
        ORDER BY o.status
        """)
    List<Object[]> getOrderStatusCounts();

    @Query("""
        SELECT o.status, COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        GROUP BY o.status
        ORDER BY o.status
        """)
    List<Object[]> getOrderStatusRevenue();

    @Query("""
        SELECT COUNT(o)
        FROM Order o
        WHERE o.user.id = :userId
        """)
    long countByUserId(@Param("userId") Long userId);

    @Query("""
        SELECT COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        WHERE o.user.id = :userId
        AND o.status <> :cancelledStatus
        """)
    BigDecimal getTotalSpentByUserId(
            @Param("userId") Long userId,
            @Param("cancelledStatus") OrderStatus cancelledStatus
    );

    @Query("""
        SELECT COUNT(o)
        FROM Order o
        WHERE o.user.id = :userId
        AND o.status IN (
            com.ecommerce.ecommerce_management.entity.OrderStatus.PLACED,
            com.ecommerce.ecommerce_management.entity.OrderStatus.CONFIRMED,
            com.ecommerce.ecommerce_management.entity.OrderStatus.SHIPPED
        )
        """)
    long countActiveOrdersByUserId(@Param("userId") Long userId);

    @Query("""
        SELECT o.status, COUNT(o)
        FROM Order o
        WHERE o.user.id = :userId
        GROUP BY o.status
        ORDER BY o.status
        """)
    List<Object[]> getOrderStatusCountsByUserId(
            @Param("userId") Long userId);

    @Query("""
        SELECT YEAR(o.orderDate),
               MONTH(o.orderDate),
               COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        WHERE o.user.id = :userId
        AND o.status <> :cancelledStatus
        GROUP BY YEAR(o.orderDate), MONTH(o.orderDate)
        ORDER BY YEAR(o.orderDate), MONTH(o.orderDate)
        """)
    List<Object[]> getMonthlySpendingByUserId(
            @Param("userId") Long userId,
            @Param("cancelledStatus") OrderStatus cancelledStatus);

    @Query("""
        SELECT YEAR(o.orderDate),
               MONTH(o.orderDate),
               COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        WHERE o.status <> :cancelledStatus
        GROUP BY YEAR(o.orderDate), MONTH(o.orderDate)
        ORDER BY YEAR(o.orderDate), MONTH(o.orderDate)
        """)
    List<Object[]> getMonthlyRevenue(
            @Param("cancelledStatus") OrderStatus cancelledStatus);

    @Query("""
        SELECT o.user.id,
               o.user.name,
               o.user.email,
               COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        WHERE o.status <> :cancelledStatus
        GROUP BY o.user.id, o.user.name, o.user.email
        ORDER BY SUM(o.totalAmount) DESC
        """)
    List<Object[]> getCustomerSpending(
            @Param("cancelledStatus") OrderStatus cancelledStatus);

    @Query("""
        SELECT o.user.id,
               o.user.name,
               o.user.email,
               COUNT(o),
               SUM(
                   CASE
                       WHEN o.status IN (
                           com.ecommerce.ecommerce_management.entity.OrderStatus.PLACED,
                           com.ecommerce.ecommerce_management.entity.OrderStatus.CONFIRMED,
                           com.ecommerce.ecommerce_management.entity.OrderStatus.SHIPPED
                       )
                       THEN 1
                       ELSE 0
                   END
               )
        FROM Order o
        GROUP BY o.user.id, o.user.name, o.user.email
        ORDER BY COUNT(o) DESC
        """)
    List<Object[]> getCustomerOrderStatistics();

    @Query("""
        SELECT o.user.id,
               o.user.name,
               o.user.email,
               o.status,
               COUNT(o)
        FROM Order o
        GROUP BY o.user.id,
                 o.user.name,
                 o.user.email,
                 o.status
        ORDER BY o.user.id, o.status
        """)
    List<Object[]> getCustomerOrderStatusStatistics();
}