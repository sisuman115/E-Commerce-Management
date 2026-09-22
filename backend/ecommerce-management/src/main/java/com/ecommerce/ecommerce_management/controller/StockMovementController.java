package com.ecommerce.ecommerce_management.controller;

import com.ecommerce.ecommerce_management.dto.StockMovementResponse;
import com.ecommerce.ecommerce_management.service.StockMovementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-movements")
public class StockMovementController {

    private final StockMovementService stockMovementService;

    public StockMovementController(StockMovementService stockMovementService) {
        this.stockMovementService = stockMovementService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<StockMovementResponse>> getProductStockHistory(
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                stockMovementService.getProductStockHistory(productId)
        );
    }
}