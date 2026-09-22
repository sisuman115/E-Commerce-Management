package com.ecommerce.ecommerce_management.service;

import com.ecommerce.ecommerce_management.entity.Wishlist;
import com.ecommerce.ecommerce_management.entity.WishlistItem;
import com.ecommerce.ecommerce_management.exception.ResourceNotFoundException;
import com.ecommerce.ecommerce_management.repository.ProductRepository;
import com.ecommerce.ecommerce_management.repository.UserRepository;
import com.ecommerce.ecommerce_management.repository.WishlistItemRepository;
import com.ecommerce.ecommerce_management.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import com.ecommerce.ecommerce_management.entity.User;
import com.ecommerce.ecommerce_management.dto.WishlistItemResponse;
import com.ecommerce.ecommerce_management.entity.Product;

import java.util.List;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public WishlistService(
            WishlistRepository wishlistRepository,
            WishlistItemRepository wishlistItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {

        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    private Wishlist getOrCreateWishlist(User user) {

        return wishlistRepository.findByUserId(user.getId())
                .orElseGet(() -> {

                    Wishlist wishlist = new Wishlist();
                    wishlist.setUser(user);

                    return wishlistRepository.save(wishlist);
                });
    }

    public WishlistItemResponse addToWishlist(
            String email,
            Long productId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Wishlist wishlist = getOrCreateWishlist(user);

        if (wishlistItemRepository
                .findByWishlistIdAndProductId(wishlist.getId(), productId)
                .isPresent()) {

            throw new RuntimeException("Product is already in your wishlist");
        }

        WishlistItem wishlistItem = new WishlistItem();
        wishlistItem.setWishlist(wishlist);
        wishlistItem.setProduct(product);

        WishlistItem savedItem = wishlistItemRepository.save(wishlistItem);

        return mapToResponse(savedItem);
    }

    private WishlistItemResponse mapToResponse(WishlistItem wishlistItem) {

        Product product = wishlistItem.getProduct();

        return new WishlistItemResponse(
                wishlistItem.getId(),
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getImageUrl(),
                product.getCategory().getId(),
                product.getCategory().getName()
        );
    }

    public List<WishlistItemResponse> getWishlist(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Wishlist wishlist = getOrCreateWishlist(user);

        List<WishlistItem> wishlistItems =
                wishlistItemRepository.findByWishlistId(wishlist.getId());

        return wishlistItems.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void removeFromWishlist(String email, Long productId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Wishlist wishlist = wishlistRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist not found"));

        WishlistItem wishlistItem = wishlistItemRepository
                .findByWishlistIdAndProductId(wishlist.getId(), productId)
                .orElseThrow(() -> new RuntimeException("Product is not in your wishlist"));

        wishlistItemRepository.delete(wishlistItem);
    }
}