package com.ecommerce.ecommerce_management.service;

import com.ecommerce.ecommerce_management.dto.StockMovementResponse;
import com.ecommerce.ecommerce_management.entity.Product;
import com.ecommerce.ecommerce_management.entity.StockMovement;
import com.ecommerce.ecommerce_management.repository.StockMovementRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockMovementService {

    private final StockMovementRepository stockMovementRepository;

    public StockMovementService(
            StockMovementRepository stockMovementRepository) {

        this.stockMovementRepository = stockMovementRepository;
    }

    public void recordMovement(
            Product product,
            Integer previousStock,
            Integer newStock,
            String reason) {

        StockMovement movement = new StockMovement();

        movement.setProduct(product);
        movement.setPreviousStock(previousStock);
        movement.setNewStock(newStock);
        movement.setReason(reason);

        stockMovementRepository.save(movement);
    }

    public List<StockMovementResponse> getProductStockHistory(
            Long productId) {

        return stockMovementRepository
                .findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private StockMovementResponse mapToResponse(
            StockMovement movement) {

        Product product = movement.getProduct();

        return new StockMovementResponse(
                movement.getId(),
                product.getId(),
                product.getName(),
                movement.getPreviousStock(),
                movement.getNewStock(),
                movement.getReason(),
                movement.getCreatedAt()
        );
    }
}