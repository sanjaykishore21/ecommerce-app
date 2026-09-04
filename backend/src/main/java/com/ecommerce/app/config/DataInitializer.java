package com.ecommerce.app.config;

import com.ecommerce.app.entity.*;
import com.ecommerce.app.repository.OrderItemRepository;
import com.ecommerce.app.repository.OrderRepository;
import com.ecommerce.app.repository.ProductRepository;
import com.ecommerce.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initUsers();
        initProducts();
        initOrders();
    }

    private void initUsers() {
        if (userRepository.count() == 0) {
            log.info("Initializing default users (Admin & User)...");

            User admin = User.builder()
                    .fullName("Admin User")
                    .email("admin@ecommerce.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ROLE_ADMIN)
                    .phone("+1 (555) 019-2834")
                    .address("742 Evergreen Terrace, Springfield, OR")
                    .build();

            User user = User.builder()
                    .fullName("John Doe")
                    .email("user@ecommerce.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.ROLE_USER)
                    .phone("+1 (555) 849-1029")
                    .address("123 Main Street, Apt 4B, New York, NY 10001")
                    .build();

            userRepository.saveAll(List.of(admin, user));
            log.info("Default users created: admin@ecommerce.com / admin123, user@ecommerce.com / user123");
        }
    }

    private void initProducts() {
        if (productRepository.count() == 0) {
            log.info("Initializing product catalog...");

            List<Product> products = List.of(
                Product.builder()
                    .name("Sony WH-1000XM5 Wireless Headphones")
                    .description("Industry-leading noise canceling with two processors and 8 microphones for exceptional sound quality and crystal-clear calls.")
                    .price(new BigDecimal("349.99"))
                    .stock(25)
                    .category("Electronics")
                    .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Product.builder()
                    .name("Apple Watch Series 9 GPS 45mm")
                    .description("Smartwatch with always-on retina display, blood oxygen and ECG apps, S9 chip, and durable water resistance up to 50m.")
                    .price(new BigDecimal("399.00"))
                    .stock(18)
                    .category("Wearables")
                    .imageUrl("https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Product.builder()
                    .name("Mechanical Gaming Keyboard RGB")
                    .description("Ultra-fast tactile mechanical switches, customizable per-key RGB backlighting, and aircraft-grade aluminum frame.")
                    .price(new BigDecimal("129.50"))
                    .stock(40)
                    .category("Gaming")
                    .imageUrl("https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Product.builder()
                    .name("Minimalist Leather Backpack")
                    .description("Crafted from full-grain water-resistant leather with a dedicated 15.6-inch laptop compartment and ergonomic straps.")
                    .price(new BigDecimal("89.99"))
                    .stock(15)
                    .category("Accessories")
                    .imageUrl("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Product.builder()
                    .name("Smart 4K Ultra HD Action Camera")
                    .description("Captures smooth 4K video at 60fps with advanced stabilization, waterproof casing, and dual touchscreens.")
                    .price(new BigDecimal("219.00"))
                    .stock(12)
                    .category("Electronics")
                    .imageUrl("https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Product.builder()
                    .name("Ergonomic Desk Chair Pro")
                    .description("Breathable mesh back with adjustable lumbar support, 3D armrests, and dynamic tilt-lock mechanism for all-day comfort.")
                    .price(new BigDecimal("279.99"))
                    .stock(8)
                    .category("Furniture")
                    .imageUrl("https://images.unsplash.com/photo-1580481077195-7387295d23f7?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Product.builder()
                    .name("Premium Ceramic Pour-Over Dripper")
                    .description("Handcrafted ceramic coffee dripper designed for optimal extraction flow and rich artisanal coffee brewing at home.")
                    .price(new BigDecimal("34.50"))
                    .stock(50)
                    .category("Kitchen")
                    .imageUrl("https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Product.builder()
                    .name("Ultra-Slim Portable Power Bank 20000mAh")
                    .description("High-capacity fast-charging power bank equipped with 65W Power Delivery USB-C port for phones, tablets, and laptops.")
                    .price(new BigDecimal("49.99"))
                    .stock(65)
                    .category("Electronics")
                    .imageUrl("https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Product.builder()
                    .name("Polarized Sunglasses Classic Wayfarer")
                    .description("100% UV400 protection with lightweight acetate frame, anti-glare scratch-resistant polarized lenses.")
                    .price(new BigDecimal("65.00"))
                    .stock(30)
                    .category("Accessories")
                    .imageUrl("https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80")
                    .build(),
                Product.builder()
                    .name("Stainless Steel Insulated Water Bottle")
                    .description("Double-wall vacuum insulation keeps cold beverages ice cold for 24 hours or hot drinks steaming for 12 hours.")
                    .price(new BigDecimal("24.99"))
                    .stock(75)
                    .category("Lifestyle")
                    .imageUrl("https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80")
                    .build()
            );

            productRepository.saveAll(products);
            log.info("Catalog initialized with {} products.", products.size());
        }
    }

    private void initOrders() {
        if (orderRepository.count() == 0) {
            User user = userRepository.findByEmail("user@ecommerce.com").orElse(null);
            List<Product> products = productRepository.findAll();

            if (user != null && products.size() >= 4) {
                log.info("Initializing sample demo orders...");

                // Order 1: Delivered
                Order order1 = Order.builder()
                        .user(user)
                        .recipientName(user.getFullName())
                        .recipientPhone(user.getPhone())
                        .shippingAddress(user.getAddress())
                        .paymentMethod("CREDIT_CARD")
                        .paymentStatus("PAID")
                        .status(OrderStatus.DELIVERED)
                        .totalAmount(new BigDecimal("479.49"))
                        .build();

                order1.addItem(OrderItem.builder()
                        .product(products.get(1))
                        .productName(products.get(1).getName())
                        .productImage(products.get(1).getImageUrl())
                        .unitPrice(products.get(1).getPrice())
                        .quantity(1)
                        .subtotal(products.get(1).getPrice())
                        .build());

                order1.addItem(OrderItem.builder()
                        .product(products.get(3))
                        .productName(products.get(3).getName())
                        .productImage(products.get(3).getImageUrl())
                        .unitPrice(new BigDecimal("80.49"))
                        .quantity(1)
                        .subtotal(new BigDecimal("80.49"))
                        .build());

                // Order 2: Shipped
                Order order2 = Order.builder()
                        .user(user)
                        .recipientName(user.getFullName())
                        .recipientPhone(user.getPhone())
                        .shippingAddress(user.getAddress())
                        .paymentMethod("UPI")
                        .paymentStatus("PAID")
                        .status(OrderStatus.SHIPPED)
                        .totalAmount(products.get(0).getPrice())
                        .build();

                order2.addItem(OrderItem.builder()
                        .product(products.get(0))
                        .productName(products.get(0).getName())
                        .productImage(products.get(0).getImageUrl())
                        .unitPrice(products.get(0).getPrice())
                        .quantity(1)
                        .subtotal(products.get(0).getPrice())
                        .build());

                // Order 3: Processing
                Order order3 = Order.builder()
                        .user(user)
                        .recipientName(user.getFullName())
                        .recipientPhone(user.getPhone())
                        .shippingAddress(user.getAddress())
                        .paymentMethod("CASH_ON_DELIVERY")
                        .paymentStatus("PENDING")
                        .status(OrderStatus.PROCESSING)
                        .totalAmount(products.get(3).getPrice())
                        .build();

                order3.addItem(OrderItem.builder()
                        .product(products.get(3))
                        .productName(products.get(3).getName())
                        .productImage(products.get(3).getImageUrl())
                        .unitPrice(products.get(3).getPrice())
                        .quantity(1)
                        .subtotal(products.get(3).getPrice())
                        .build());

                orderRepository.saveAll(List.of(order1, order2, order3));
                log.info("Initialized 3 demo orders with items.");
            }
        }
    }
}
