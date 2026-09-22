package com.ecommerce.ecommerce_management.service;

import com.ecommerce.ecommerce_management.dto.AddToCartRequest;
import com.ecommerce.ecommerce_management.dto.CartItemResponse;
import com.ecommerce.ecommerce_management.dto.CartResponse;
import com.ecommerce.ecommerce_management.entity.Cart;
import com.ecommerce.ecommerce_management.entity.CartItem;
import com.ecommerce.ecommerce_management.entity.Product;
import com.ecommerce.ecommerce_management.entity.User;
import com.ecommerce.ecommerce_management.exception.ResourceNotFoundException;
import com.ecommerce.ecommerce_management.repository.CartItemRepository;
import com.ecommerce.ecommerce_management.repository.CartRepository;
import com.ecommerce.ecommerce_management.repository.ProductRepository;
import com.ecommerce.ecommerce_management.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {

        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public CartResponse addToCart(
            String email,
            AddToCartRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        if (request.getQuantity() > product.getStock()) {
            throw new RuntimeException("Insufficient stock");
        }

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {

                    Cart newCart = new Cart();
                    newCart.setUser(user);

                    return cartRepository.save(newCart);
                });

        CartItem cartItem = cartItemRepository
                .findByCartIdAndProductId(
                        cart.getId(),
                        product.getId()
                )
                .orElse(null);

        if (cartItem != null) {

            int newQuantity =
                    cartItem.getQuantity() + request.getQuantity();

            if (newQuantity > product.getStock()) {
                throw new RuntimeException("Insufficient stock");
            }

            cartItem.setQuantity(newQuantity);

        } else {

            cartItem = new CartItem();

            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(request.getQuantity());
        }

        cartItemRepository.save(cartItem);

        return getCart(email);
    }

    public CartResponse getCart(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {

                    Cart newCart = new Cart();
                    newCart.setUser(user);

                    return cartRepository.save(newCart);
                });

        List<CartItemResponse> items =
                cartItemRepository.findByCartId(cart.getId())
                        .stream()
                        .map(this::mapToCartItemResponse)
                        .toList();

        BigDecimal total = items.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(
                cart.getId(),
                items,
                total
        );
    }

    private CartItemResponse mapToCartItemResponse(
            CartItem cartItem) {

        Product product = cartItem.getProduct();

        BigDecimal subtotal =
                product.getPrice()
                        .multiply(
                                BigDecimal.valueOf(
                                        cartItem.getQuantity()
                                )
                        );

        return new CartItemResponse(
                cartItem.getId(),
                product.getId(),
                product.getName(),
                product.getPrice(),
                cartItem.getQuantity(),
                subtotal,
                product.getImageUrl()
        );
    }

    public CartResponse updateCartItem(
            String email,
            Long cartItemId,
            Integer quantity) {

        if (quantity == null || quantity < 1) {
            throw new RuntimeException("Quantity must be at least 1");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this user");
        }

        Product product = cartItem.getProduct();

        if (quantity > product.getStock()) {
            throw new RuntimeException("Insufficient stock");
        }

        cartItem.setQuantity(quantity);

        cartItemRepository.save(cartItem);

        return getCart(email);
    }

    public CartResponse removeCartItem(
            String email,
            Long cartItemId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this user");
        }

        cartItemRepository.delete(cartItem);

        return getCart(email);
    }
}