package com.ecommerce.ecommerce_management.service;

import com.ecommerce.ecommerce_management.dto.*;
import com.ecommerce.ecommerce_management.entity.OrderStatus;
import com.ecommerce.ecommerce_management.repository.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

import com.ecommerce.ecommerce_management.entity.Role;
import com.ecommerce.ecommerce_management.repository.OrderItemRepository;
import com.ecommerce.ecommerce_management.dto.CustomerSpendingResponse;
import com.ecommerce.ecommerce_management.dto.CustomerOrderStatisticsResponse;
import com.ecommerce.ecommerce_management.dto.CustomerOrderStatusStatisticsResponse;

@Service
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final OrderItemRepository orderItemRepository;

    public AdminDashboardService(
            UserRepository userRepository,
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            OrderRepository orderRepository,
            ProductService productService,
            OrderItemRepository orderItemRepository) {

        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
        this.productService = productService;
        this.orderItemRepository = orderItemRepository;
    }

    public AdminDashboardResponse getDashboard() {

        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalCategories = categoryRepository.count();
        long totalOrders = orderRepository.count();

        BigDecimal totalRevenue =
                orderRepository.getTotalRevenue(OrderStatus.CANCELLED);

        long pendingOrders =
                orderRepository.countByStatus(OrderStatus.PLACED);

        long lowStockProducts =
                productService.getLowStockProducts().size();

        return new AdminDashboardResponse(
                totalUsers,
                totalProducts,
                totalCategories,
                totalOrders,
                totalRevenue,
                pendingOrders,
                lowStockProducts
        );
    }

    public List<OrderStatusCountResponse> getOrderStatusCounts() {

        List<Object[]> results = orderRepository.getOrderStatusCounts();

        List<OrderStatusCountResponse> response = new ArrayList<>();

        for (Object[] result : results) {

            OrderStatus status = (OrderStatus) result[0];
            long count = (Long) result[1];

            response.add(
                    new OrderStatusCountResponse(status, count)
            );
        }

        return response;
    }

    public List<OrderStatusRevenueResponse> getOrderStatusRevenue() {

        List<Object[]> results = orderRepository.getOrderStatusRevenue();

        List<OrderStatusRevenueResponse> response = new ArrayList<>();

        for (Object[] result : results) {

            OrderStatus status = (OrderStatus) result[0];
            BigDecimal revenue = (BigDecimal) result[1];

            response.add(
                    new OrderStatusRevenueResponse(status, revenue)
            );
        }

        return response;
    }

    public List<UserRoleCountResponse> getUserRoleCounts() {

        List<Object[]> results = userRepository.getUserRoleCounts();

        List<UserRoleCountResponse> response = new ArrayList<>();

        for (Object[] result : results) {

            Role role = (Role) result[0];
            long count = (Long) result[1];

            response.add(
                    new UserRoleCountResponse(role, count)
            );
        }

        return response;
    }

    public List<CategoryProductCountResponse> getCategoryProductCounts() {

        List<Object[]> results = categoryRepository.getCategoryProductCounts();

        List<CategoryProductCountResponse> response = new ArrayList<>();

        for (Object[] result : results) {

            Long categoryId = (Long) result[0];
            String categoryName = (String) result[1];
            long productCount = (Long) result[2];

            response.add(
                    new CategoryProductCountResponse(
                            categoryId,
                            categoryName,
                            productCount
                    )
            );
        }

        return response;
    }

    public List<ProductSalesResponse> getProductSales() {

        List<Object[]> results = orderItemRepository.getProductSales();

        List<ProductSalesResponse> response = new ArrayList<>();

        for (Object[] result : results) {

            Long productId = (Long) result[0];
            String productName = (String) result[1];
            long quantitySold = (Long) result[2];

            response.add(
                    new ProductSalesResponse(
                            productId,
                            productName,
                            quantitySold
                    )
            );
        }

        return response;
    }

    public List<MonthlyRevenueResponse> getMonthlyRevenue() {

        List<Object[]> results =
                orderRepository.getMonthlyRevenue(
                        OrderStatus.CANCELLED
                );

        List<MonthlyRevenueResponse> response =
                new ArrayList<>();

        for (Object[] result : results) {

            int year = ((Number) result[0]).intValue();
            int month = ((Number) result[1]).intValue();
            BigDecimal revenue = (BigDecimal) result[2];

            response.add(
                    new MonthlyRevenueResponse(
                            year,
                            month,
                            revenue
                    )
            );
        }

        return response;
    }

    public List<ProductRevenueResponse> getProductRevenue() {

        List<Object[]> results =
                orderItemRepository.getProductRevenue(
                        OrderStatus.CANCELLED
                );

        List<ProductRevenueResponse> response =
                new ArrayList<>();

        for (Object[] result : results) {

            Long productId = ((Number) result[0]).longValue();
            String productName = (String) result[1];
            BigDecimal revenue = (BigDecimal) result[2];

            response.add(
                    new ProductRevenueResponse(
                            productId,
                            productName,
                            revenue
                    )
            );
        }

        return response;
    }

    public List<CustomerSpendingResponse> getCustomerSpending() {

        List<Object[]> results =
                orderRepository.getCustomerSpending(
                        OrderStatus.CANCELLED
                );

        List<CustomerSpendingResponse> response =
                new ArrayList<>();

        for (Object[] result : results) {

            Long userId = ((Number) result[0]).longValue();
            String userName = (String) result[1];
            String email = (String) result[2];
            BigDecimal totalSpent = (BigDecimal) result[3];

            response.add(
                    new CustomerSpendingResponse(
                            userId,
                            userName,
                            email,
                            totalSpent
                    )
            );
        }

        return response;
    }

    public List<CustomerOrderStatisticsResponse> getCustomerOrderStatistics() {

        List<Object[]> results =
                orderRepository.getCustomerOrderStatistics();

        List<CustomerOrderStatisticsResponse> response =
                new ArrayList<>();

        for (Object[] result : results) {

            Long userId = ((Number) result[0]).longValue();
            String userName = (String) result[1];
            String email = (String) result[2];
            Long totalOrders = ((Number) result[3]).longValue();
            Long activeOrders = ((Number) result[4]).longValue();

            response.add(
                    new CustomerOrderStatisticsResponse(
                            userId,
                            userName,
                            email,
                            totalOrders,
                            activeOrders
                    )
            );
        }

        return response;
    }

    public List<CustomerOrderStatusStatisticsResponse> getCustomerOrderStatusStatistics() {

        List<Object[]> results =
                orderRepository.getCustomerOrderStatusStatistics();

        List<CustomerOrderStatusStatisticsResponse> response =
                new ArrayList<>();

        for (Object[] result : results) {

            Long userId = ((Number) result[0]).longValue();
            String userName = (String) result[1];
            String email = (String) result[2];
            OrderStatus status = (OrderStatus) result[3];
            Long orderCount = ((Number) result[4]).longValue();

            response.add(
                    new CustomerOrderStatusStatisticsResponse(
                            userId,
                            userName,
                            email,
                            status,
                            orderCount
                    )
            );
        }

        return response;
    }
}