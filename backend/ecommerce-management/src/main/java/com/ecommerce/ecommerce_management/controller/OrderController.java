package com.ecommerce.ecommerce_management.controller;

import com.ecommerce.ecommerce_management.dto.OrderResponse;
import com.ecommerce.ecommerce_management.entity.OrderStatus;
import com.ecommerce.ecommerce_management.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.ecommerce.ecommerce_management.dto.PlaceOrderRequest;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @Valid @RequestBody PlaceOrderRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        OrderResponse response =
                orderService.placeOrder(email, request.getAddressId());

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            Authentication authentication) {

        String email = authentication.getName();

        List<OrderResponse> orders = orderService.getMyOrders(email);

        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getMyOrder(
            @PathVariable Long orderId,
            Authentication authentication) {

        String email = authentication.getName();

        OrderResponse response =
                orderService.getMyOrder(email, orderId);

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {

        List<OrderResponse> orders = orderService.getAllOrders();

        return ResponseEntity.ok(orders);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {

        OrderResponse response =
                orderService.updateOrderStatus(orderId, status);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelMyOrder(
            @PathVariable Long orderId,
            Authentication authentication) {

        String email = authentication.getName();

        OrderResponse response =
                orderService.cancelMyOrder(email, orderId);

        return ResponseEntity.ok(response);
    }
}