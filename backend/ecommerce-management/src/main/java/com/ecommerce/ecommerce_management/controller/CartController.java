package com.ecommerce.ecommerce_management.controller;

import com.ecommerce.ecommerce_management.dto.AddToCartRequest;
import com.ecommerce.ecommerce_management.dto.CartResponse;
import com.ecommerce.ecommerce_management.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        CartResponse response =
                cartService.addToCart(email, request);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                cartService.getCart(email)
        );
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity,
            Authentication authentication) {

        String email = authentication.getName();

        CartResponse response =
                cartService.updateCartItem(
                        email,
                        cartItemId,
                        quantity
                );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> removeCartItem(
            @PathVariable Long cartItemId,
            Authentication authentication) {

        String email = authentication.getName();

        CartResponse response =
                cartService.removeCartItem(
                        email,
                        cartItemId
                );

        return ResponseEntity.ok(response);
    }
}