package com.ecommerce.ecommerce_management.controller;

import com.ecommerce.ecommerce_management.dto.ProductRequest;
import com.ecommerce.ecommerce_management.dto.ProductResponse;
import com.ecommerce.ecommerce_management.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest request) {

        ProductResponse response =
                productService.createProduct(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                productService.getAllProducts(email)
        );
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(
            @PathVariable Long categoryId,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                productService.getProductsByCategory(categoryId, email)
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam String name,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                productService.searchProducts(name, email)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductResponse>> getLowStockProducts() {

        return ResponseEntity.ok(
                productService.getLowStockProducts()
        );
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductResponse> getProductById(
            @PathVariable Long productId,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                productService.getProductById(productId, email)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{productId}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody ProductRequest request) {

        ProductResponse response =
                productService.updateProduct(productId, request);

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{productId}/stock")
    public ResponseEntity<ProductResponse> updateProductStock(
            @PathVariable Long productId,
            @RequestParam Integer quantity) {

        ProductResponse response =
                productService.updateProductStock(productId, quantity);

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long productId) {

        productService.deleteProduct(productId);

        return ResponseEntity.noContent().build();
    }

}