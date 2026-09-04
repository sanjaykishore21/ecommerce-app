package com.ecommerce.app.service;

import com.ecommerce.app.dto.CartItemRequest;
import com.ecommerce.app.dto.CartItemResponse;
import com.ecommerce.app.dto.CartResponse;
import com.ecommerce.app.entity.CartItem;
import com.ecommerce.app.entity.Product;
import com.ecommerce.app.entity.User;
import com.ecommerce.app.exception.BadRequestException;
import com.ecommerce.app.exception.ResourceNotFoundException;
import com.ecommerce.app.repository.CartItemRepository;
import com.ecommerce.app.repository.ProductRepository;
import com.ecommerce.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartResponse getCart(String userEmail) {
        User user = getUser(userEmail);
        List<CartItem> cartItems = cartItemRepository.findByUserOrderByCreatedAtDesc(user);
        return buildCartResponse(cartItems);
    }

    @Transactional
    public CartResponse addToCart(String userEmail, CartItemRequest request) {
        User user = getUser(userEmail);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock available for " + product.getName() + ". Only " + product.getStock() + " available.");
        }

        Optional<CartItem> existingItemOpt = cartItemRepository.findByUserAndProduct(user, product);

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            int newQuantity = existingItem.getQuantity() + request.getQuantity();

            if (product.getStock() < newQuantity) {
                throw new BadRequestException("Cannot add more items. Maximum stock available: " + product.getStock());
            }

            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cartItemRepository.save(newItem);
        }

        return getCart(userEmail);
    }

    @Transactional
    public CartResponse updateCartItemQuantity(String userEmail, Long cartItemId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            return removeCartItem(userEmail, cartItemId);
        }

        User user = getUser(userEmail);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You are not authorized to modify this cart item");
        }

        if (cartItem.getProduct().getStock() < quantity) {
            throw new BadRequestException("Insufficient stock. Only " + cartItem.getProduct().getStock() + " units available.");
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);

        return getCart(userEmail);
    }

    @Transactional
    public CartResponse removeCartItem(String userEmail, Long cartItemId) {
        User user = getUser(userEmail);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You are not authorized to modify this cart item");
        }

        cartItemRepository.delete(cartItem);
        return getCart(userEmail);
    }

    @Transactional
    public void clearCart(String userEmail) {
        User user = getUser(userEmail);
        cartItemRepository.deleteByUser(user);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private CartResponse buildCartResponse(List<CartItem> cartItems) {
        List<CartItemResponse> itemResponses = cartItems.stream().map(item -> {
            Product p = item.getProduct();
            BigDecimal subtotal = p.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            return CartItemResponse.builder()
                    .id(item.getId())
                    .productId(p.getId())
                    .productName(p.getName())
                    .productCategory(p.getCategory())
                    .productImage(p.getImageUrl())
                    .unitPrice(p.getPrice())
                    .stock(p.getStock())
                    .quantity(item.getQuantity())
                    .subtotal(subtotal)
                    .build();
        }).collect(Collectors.toList());

        int totalItems = itemResponses.stream().mapToInt(CartItemResponse::getQuantity).sum();
        BigDecimal totalPrice = itemResponses.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .items(itemResponses)
                .totalItems(totalItems)
                .totalPrice(totalPrice)
                .build();
    }
}
