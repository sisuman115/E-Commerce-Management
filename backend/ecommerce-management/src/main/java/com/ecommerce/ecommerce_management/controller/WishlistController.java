package com.ecommerce.ecommerce_management.controller;

import com.ecommerce.ecommerce_management.dto.WishlistItemResponse;
import com.ecommerce.ecommerce_management.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping("/items/{productId}")
    public ResponseEntity<WishlistItemResponse> addToWishlist(
            Authentication authentication,
            @PathVariable Long productId) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                wishlistService.addToWishlist(email, productId)
        );
    }

    @GetMapping
    public ResponseEntity<List<WishlistItemResponse>> getWishlist(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                wishlistService.getWishlist(email)
        );
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<String> removeFromWishlist(
            Authentication authentication,
            @PathVariable Long productId) {

        String email = authentication.getName();

        wishlistService.removeFromWishlist(email, productId);

        return ResponseEntity.ok("Product removed from wishlist");
    }
}