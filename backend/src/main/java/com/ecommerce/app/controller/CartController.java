package com.ecommerce.app.controller;

import com.ecommerce.app.dto.ApiResponse;
import com.ecommerce.app.dto.CartItemRequest;
import com.ecommerce.app.dto.CartResponse;
import com.ecommerce.app.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/cart", "/cart"})
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(Authentication authentication) {
        CartResponse cart = cartService.getCart(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            Authentication authentication,
            @Valid @RequestBody CartItemRequest request) {
        CartResponse cart = cartService.addToCart(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success(cart, "Item added to cart"));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<ApiResponse<CartResponse>> updateQuantity(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        CartResponse cart = cartService.updateCartItemQuantity(authentication.getName(), id, quantity);
        return ResponseEntity.ok(ApiResponse.success(cart, "Cart updated"));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            Authentication authentication,
            @PathVariable Long id) {
        CartResponse cart = cartService.removeCartItem(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success(cart, "Item removed from cart"));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(null, "Cart cleared"));
    }
}
