package com.ecommerce.ecommerce_management.service;

import com.ecommerce.ecommerce_management.dto.OrderResponse;
import com.ecommerce.ecommerce_management.entity.*;
import com.ecommerce.ecommerce_management.exception.ResourceNotFoundException;
import com.ecommerce.ecommerce_management.repository.*;
import org.springframework.stereotype.Service;

import com.ecommerce.ecommerce_management.dto.OrderItemResponse;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final StockMovementService stockMovementService;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            AddressRepository addressRepository,
            StockMovementService stockMovementService) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.stockMovementService = stockMovementService;
    }

    @Transactional
    public OrderResponse placeOrder(String email, Long addressId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = addressRepository
                .findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            if (cartItem.getQuantity() > product.getStock()) {
                throw new RuntimeException(
                        "Insufficient stock for product: " + product.getName()
                );
            }
        }

        BigDecimal totalAmount = cartItems.stream()
                .map(cartItem ->
                        cartItem.getProduct()
                                .getPrice()
                                .multiply(BigDecimal.valueOf(cartItem.getQuantity()))
                )
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = new Order();

        order.setUser(user);
        order.setTotalAmount(totalAmount);
        order.setStatus(OrderStatus.PLACED);
        order.setOrderDate(LocalDateTime.now());

        order.setShippingFullName(address.getFullName());
        order.setShippingPhone(address.getPhone());
        order.setShippingAddressLine(address.getAddressLine());
        order.setShippingCity(address.getCity());
        order.setShippingState(address.getState());
        order.setShippingPincode(address.getPincode());

        Order savedOrder = orderRepository.save(order);

        List<OrderItemResponse> orderItemResponses = new ArrayList<>();

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());

            OrderItem savedOrderItem = orderItemRepository.save(orderItem);

            BigDecimal subtotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));

            OrderItemResponse response = new OrderItemResponse(
                    savedOrderItem.getId(),
                    product.getId(),
                    product.getName(),
                    product.getPrice(),
                    cartItem.getQuantity(),
                    subtotal,
                    product.getImageUrl()
            );

            orderItemResponses.add(response);

            Integer previousStock = product.getStock();

            product.setStock(product.getStock() - cartItem.getQuantity());

            productRepository.save(product);

            stockMovementService.recordMovement(
                    product,
                    previousStock,
                    product.getStock(),
                    "ORDER"
            );
        }

        cartItemRepository.deleteAll(cartItems);

        return new OrderResponse(
                savedOrder.getId(),
                savedOrder.getTotalAmount(),
                savedOrder.getStatus(),
                savedOrder.getOrderDate(),
                savedOrder.getShippingFullName(),
                savedOrder.getShippingPhone(),
                savedOrder.getShippingAddressLine(),
                savedOrder.getShippingCity(),
                savedOrder.getShippingState(),
                savedOrder.getShippingPincode(),
                orderItemResponses
        );
    }

    public List<OrderResponse> getMyOrders(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Order> orders = orderRepository.findByUserId(user.getId());

        return orders.stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    public OrderResponse getMyOrder(String email, Long orderId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Order does not belong to this user");
        }

        return mapToOrderResponse(order);
    }

    public List<OrderResponse> getAllOrders() {

        return orderRepository.findAll()
                .stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        OrderStatus currentStatus = order.getStatus();

        if (currentStatus == OrderStatus.DELIVERED) {
            throw new RuntimeException(
                    "Delivered order status cannot be changed"
            );
        }

        if (currentStatus == OrderStatus.CANCELLED) {
            throw new RuntimeException(
                    "Cancelled order status cannot be changed"
            );
        }

        boolean validTransition = false;

        if (currentStatus == OrderStatus.PLACED) {
            validTransition =
                    status == OrderStatus.CONFIRMED ||
                            status == OrderStatus.CANCELLED;

        } else if (currentStatus == OrderStatus.CONFIRMED) {
            validTransition =
                    status == OrderStatus.SHIPPED ||
                            status == OrderStatus.CANCELLED;

        } else if (currentStatus == OrderStatus.SHIPPED) {
            validTransition =
                    status == OrderStatus.DELIVERED ||
                            status == OrderStatus.CANCELLED;
        }

        if (!validTransition) {
            throw new RuntimeException(
                    "Invalid order status transition from "
                            + currentStatus + " to " + status
            );
        }

        if (status == OrderStatus.CANCELLED) {

            List<OrderItem> orderItems =
                    orderItemRepository.findByOrderId(order.getId());

            for (OrderItem orderItem : orderItems) {

                Product product = orderItem.getProduct();

                product.setStock(
                        product.getStock() + orderItem.getQuantity()
                );

                productRepository.save(product);
            }
        }

        order.setStatus(status);

        Order savedOrder = orderRepository.save(order);

        return mapToOrderResponse(savedOrder);
    }

    private OrderResponse mapToOrderResponse(Order order) {

        List<OrderItemResponse> items = orderItemRepository
                .findByOrderId(order.getId())
                .stream()
                .map(orderItem -> {

                    Product product = orderItem.getProduct();

                    BigDecimal subtotal = orderItem.getPrice()
                            .multiply(BigDecimal.valueOf(orderItem.getQuantity()));

                    return new OrderItemResponse(
                            orderItem.getId(),
                            product.getId(),
                            product.getName(),
                            orderItem.getPrice(),
                            orderItem.getQuantity(),
                            subtotal,
                            product.getImageUrl()
                    );
                })
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getOrderDate(),
                order.getShippingFullName(),
                order.getShippingPhone(),
                order.getShippingAddressLine(),
                order.getShippingCity(),
                order.getShippingState(),
                order.getShippingPincode(),
                items
        );
    }

    @Transactional
    public OrderResponse cancelMyOrder(String email, Long orderId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // Make sure the order belongs to the logged-in customer
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to cancel this order");
        }

        // Customer can cancel only PLACED or CONFIRMED orders
        if (order.getStatus() != OrderStatus.PLACED
                && order.getStatus() != OrderStatus.CONFIRMED) {

            throw new RuntimeException(
                    "Order cannot be cancelled after it has been shipped"
            );
        }

        // Restore product stock
        List<OrderItem> orderItems =
                orderItemRepository.findByOrderId(order.getId());

        for (OrderItem orderItem : orderItems) {

            Product product = orderItem.getProduct();

            Integer previousStock = product.getStock();

            product.setStock(product.getStock() + orderItem.getQuantity());

            productRepository.save(product);

            stockMovementService.recordMovement(
                    product,
                    previousStock,
                    product.getStock(),
                    "ORDER_CANCELLED"
            );
        }

        order.setStatus(OrderStatus.CANCELLED);

        Order savedOrder = orderRepository.save(order);

        return mapToOrderResponse(savedOrder);
    }
}