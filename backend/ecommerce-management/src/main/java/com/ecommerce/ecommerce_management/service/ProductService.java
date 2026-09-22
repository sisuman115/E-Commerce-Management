package com.ecommerce.ecommerce_management.service;

import com.ecommerce.ecommerce_management.dto.ProductRequest;
import com.ecommerce.ecommerce_management.dto.ProductResponse;
import com.ecommerce.ecommerce_management.entity.Category;
import com.ecommerce.ecommerce_management.entity.Product;
import com.ecommerce.ecommerce_management.exception.ResourceNotFoundException;
import com.ecommerce.ecommerce_management.repository.*;
import org.springframework.stereotype.Service;
import com.ecommerce.ecommerce_management.entity.Wishlist;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;
    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final UserRepository userRepository;
    private final StockMovementService stockMovementService;
    private final StockMovementRepository stockMovementRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;

    public ProductService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            ReviewRepository reviewRepository,
            WishlistRepository wishlistRepository,
            WishlistItemRepository wishlistItemRepository,
            UserRepository userRepository,
            StockMovementService stockMovementService,
            StockMovementRepository stockMovementRepository,
            CartItemRepository cartItemRepository,
            OrderItemRepository orderItemRepository) {

        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.reviewRepository = reviewRepository;
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.userRepository = userRepository;
        this.stockMovementService = stockMovementService;
        this.stockMovementRepository = stockMovementRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public ProductResponse createProduct(ProductRequest request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found"));

        Product product = new Product();

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setLowStockThreshold(request.getLowStockThreshold());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(category);

        Product savedProduct = productRepository.save(product);

        if (savedProduct.getStock() > 0) {
            stockMovementService.recordMovement(
                    savedProduct,
                    0,
                    savedProduct.getStock(),
                    "INITIAL_STOCK"
            );
        }

        return mapToResponse(savedProduct, null);
    }

    public ProductResponse updateProduct(
            Long productId,
            ProductRequest request) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());

        // Capture old stock before changing it
        Integer previousStock = product.getStock();

        product.setStock(request.getStock());

        product.setLowStockThreshold(request.getLowStockThreshold());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(category);

        Product updatedProduct = productRepository.save(product);

        // Record stock movement only when stock actually changes
        if (!previousStock.equals(request.getStock())) {

            stockMovementService.recordMovement(
                    updatedProduct,
                    previousStock,
                    request.getStock(),
                    "ADMIN_PRODUCT_UPDATE"
            );
        }

        return mapToResponse(updatedProduct, null);
    }

    public ProductResponse updateProductStock(Long productId, Integer quantity) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (quantity < 0) {
            throw new RuntimeException("Stock cannot be negative");
        }

        Integer previousStock = product.getStock();

        product.setStock(quantity);

        Product savedProduct = productRepository.save(product);

        stockMovementService.recordMovement(
                savedProduct,
                previousStock,
                quantity,
                "ADMIN_ADJUSTMENT"
        );

        return mapToResponse(savedProduct, null);
    }

    @Transactional
    public void deleteProduct(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        // Product cannot be deleted if it exists in order history
        if (orderItemRepository.existsByProductId(productId)) {
            throw new RuntimeException(
                    "Product cannot be deleted because it has already been ordered"
            );
        }

        // Delete stock history
        stockMovementRepository.deleteByProductId(productId);

        // Delete wishlist entries
        wishlistItemRepository.deleteByProductId(productId);

        // Delete cart entries
        cartItemRepository.deleteByProductId(productId);

        // Finally delete product
        productRepository.delete(product);
    }

    public List<ProductResponse> getAllProducts(String email) {

        return productRepository.findAll()
                .stream()
                .map(product -> mapToResponse(product, email))
                .toList();
    }

    public List<ProductResponse> getProductsByCategory(Long categoryId, String email) {

        return productRepository.findByCategoryId(categoryId)
                .stream()
                .map(product -> mapToResponse(product, email))
                .toList();
    }

    public ProductResponse getProductById(Long productId, String email) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        return mapToResponse(product, email);
    }

    public List<ProductResponse> searchProducts(String name, String email) {

        return productRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(product -> mapToResponse(product, email))
                .toList();
    }

    public List<ProductResponse> getLowStockProducts() {

        return productRepository.findLowStockProducts()
                .stream()
                .map(product -> mapToResponse(product, null))
                .toList();
    }

    private ProductResponse mapToResponse(Product product, String email) {

        Double averageRating = reviewRepository
                .getAverageRatingByProductId(product.getId());

        Long reviewCount = reviewRepository
                .countByProductId(product.getId());

        long wishlistCount = wishlistItemRepository
                .countByProductId(product.getId());

        ProductResponse response = new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getImageUrl(),
                product.getCategory().getId(),
                product.getCategory().getName()
        );

        response.setAverageRating(
                averageRating != null ? averageRating : 0.0
        );

        response.setReviewCount(reviewCount);
        response.setLowStockThreshold(product.getLowStockThreshold());

        boolean isLowStock = product.getLowStockThreshold() != null
                && product.getStock() <= product.getLowStockThreshold();

        response.setIsLowStock(isLowStock);

        boolean isWishlisted = false;

        if (email != null) {
            Wishlist wishlist = wishlistRepository.findByUserId(
                    userRepository.findByEmail(email)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                            .getId()
            ).orElse(null);

            if (wishlist != null) {
                isWishlisted = wishlistItemRepository
                        .findByWishlistIdAndProductId(wishlist.getId(), product.getId())
                        .isPresent();
            }
        }

        response.setIsWishlisted(isWishlisted);
        response.setWishlistCount(wishlistCount);

        return response;
    }
}