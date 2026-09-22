package com.ecommerce.ecommerce_management.service;

import com.ecommerce.ecommerce_management.dto.CustomerDashboardResponse;
import com.ecommerce.ecommerce_management.entity.OrderStatus;
import com.ecommerce.ecommerce_management.entity.User;
import com.ecommerce.ecommerce_management.exception.ResourceNotFoundException;
import com.ecommerce.ecommerce_management.repository.OrderRepository;
import com.ecommerce.ecommerce_management.repository.UserRepository;
import com.ecommerce.ecommerce_management.repository.WishlistItemRepository;

import org.springframework.stereotype.Service;

import com.ecommerce.ecommerce_management.dto.CustomerOrderStatusCountResponse;
import java.util.ArrayList;
import java.util.List;
import com.ecommerce.ecommerce_management.dto.MonthlySpendingResponse;
import java.math.BigDecimal;

@Service
public class CustomerDashboardService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final WishlistItemRepository wishlistItemRepository;

    public CustomerDashboardService(
            UserRepository userRepository,
            OrderRepository orderRepository,
            WishlistItemRepository wishlistItemRepository) {

        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.wishlistItemRepository = wishlistItemRepository;
    }

    public CustomerDashboardResponse getDashboard(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Long userId = user.getId();

        long totalOrders =
                orderRepository.countByUserId(userId);

        BigDecimal totalSpent =
                orderRepository.getTotalSpentByUserId(
                        userId,
                        OrderStatus.CANCELLED
                );

        long activeOrders =
                orderRepository.countActiveOrdersByUserId(userId);

        long wishlistItems =
                wishlistItemRepository.countByUserId(userId);

        return new CustomerDashboardResponse(
                totalOrders,
                totalSpent,
                activeOrders,
                wishlistItems
        );
    }

    public List<CustomerOrderStatusCountResponse> getOrderStatusCounts(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Object[]> results =
                orderRepository.getOrderStatusCountsByUserId(user.getId());

        List<CustomerOrderStatusCountResponse> response =
                new ArrayList<>();

        for (Object[] result : results) {

            OrderStatus status = (OrderStatus) result[0];
            long count = (Long) result[1];

            response.add(
                    new CustomerOrderStatusCountResponse(
                            status,
                            count
                    )
            );
        }

        return response;
    }

    public List<MonthlySpendingResponse> getMonthlySpending(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Object[]> results =
                orderRepository.getMonthlySpendingByUserId(
                        user.getId(),
                        OrderStatus.CANCELLED
                );

        List<MonthlySpendingResponse> response =
                new ArrayList<>();

        for (Object[] result : results) {

            int year = ((Number) result[0]).intValue();
            int month = ((Number) result[1]).intValue();
            BigDecimal amount = (BigDecimal) result[2];

            response.add(
                    new MonthlySpendingResponse(
                            year,
                            month,
                            amount
                    )
            );
        }

        return response;
    }
}