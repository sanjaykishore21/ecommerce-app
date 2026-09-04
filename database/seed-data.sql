-- Seed Data for E-Commerce Web Application
USE ecommerce_db;

-- 1. Insert Initial Users (Passwords will also be automatically verified/hashed by Spring Boot DataInitializer)
-- Note: 'admin123' and 'user123'
INSERT INTO users (id, full_name, email, password, role, phone, address) VALUES
(1, 'Admin User', 'admin@ecommerce.com', '$2a$10$gP1.cZ6t09pE/6Qv6s4nO.gT8Lz5rP5W8j2G4s8d9k1l2m3n4o5p6', 'ROLE_ADMIN', '+1 (555) 019-2834', '742 Evergreen Terrace, Springfield, OR'),
(2, 'John Doe', 'user@ecommerce.com', '$2a$10$gP1.cZ6t09pE/6Qv6s4nO.gT8Lz5rP5W8j2G4s8d9k1l2m3n4o5p6', 'ROLE_USER', '+1 (555) 849-1029', '123 Main Street, Apt 4B, New York, NY')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 2. Insert Products
INSERT INTO products (id, name, description, price, stock, category, image_url) VALUES
(1, 'Sony WH-1000XM5 Wireless Headphones', 'Industry-leading noise canceling with two processors and 8 microphones for exceptional sound quality and crystal-clear calls.', 349.99, 25, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'),
(2, 'Apple Watch Series 9 GPS 45mm', 'Smartwatch with always-on retina display, blood oxygen and ECG apps, S9 chip, and durable water resistance up to 50m.', 399.00, 18, 'Wearables', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80'),
(3, 'Mechanical Gaming Keyboard RGB', 'Ultra-fast tactile mechanical switches, customizable per-key RGB backlighting, and aircraft-grade aluminum frame.', 129.50, 40, 'Gaming', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80'),
(4, 'Minimalist Leather Backpack', 'Crafted from full-grain water-resistant leather with a dedicated 15.6-inch laptop compartment and ergonomic straps.', 89.99, 15, 'Accessories', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80'),
(5, 'Smart 4K Ultra HD Action Camera', 'Captures smooth 4K video at 60fps with advanced stabilization, waterproof casing, and dual touchscreens.', 219.00, 12, 'Electronics', 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'),
(6, 'Ergonomic Desk Chair Pro', 'Breathable mesh back with adjustable lumbar support, 3D armrests, and dynamic tilt-lock mechanism for all-day comfort.', 279.99, 8, 'Furniture', 'https://images.unsplash.com/photo-1580481077195-7387295d23f7?w=600&auto=format&fit=crop&q=80'),
(7, 'Premium Ceramic Pour-Over Dripper', 'Handcrafted ceramic coffee dripper designed for optimal extraction flow and rich artisanal coffee brewing at home.', 34.50, 50, 'Kitchen', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'),
(8, 'Ultra-Slim Portable Power Bank 20000mAh', 'High-capacity fast-charging power bank equipped with 65W Power Delivery USB-C port for phones, tablets, and laptops.', 49.99, 65, 'Electronics', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80'),
(9, 'Polarized Sunglasses Classic Wayfarer', '100% UV400 protection with lightweight acetate frame, anti-glare scratch-resistant polarized lenses.', 65.00, 30, 'Accessories', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80'),
(10, 'Stainless Steel Insulated Water Bottle', 'Double-wall vacuum insulation keeps cold beverages ice cold for 24 hours or hot drinks steaming for 12 hours.', 24.99, 75, 'Lifestyle', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80')
ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), stock=VALUES(stock), image_url=VALUES(image_url);

-- 3. Insert Sample Past Orders for Demo User
INSERT INTO orders (id, user_id, total_amount, status, shipping_address, recipient_name, recipient_phone, payment_method, payment_status) VALUES
(101, 2, 479.49, 'DELIVERED', '123 Main Street, Apt 4B, New York, NY 10001', 'John Doe', '+1 (555) 849-1029', 'CREDIT_CARD', 'PAID'),
(102, 2, 349.99, 'SHIPPED', '123 Main Street, Apt 4B, New York, NY 10001', 'John Doe', '+1 (555) 849-1029', 'UPI', 'PAID'),
(103, 2, 89.99, 'PROCESSING', '123 Main Street, Apt 4B, New York, NY 10001', 'John Doe', '+1 (555) 849-1029', 'CASH_ON_DELIVERY', 'PENDING')
ON DUPLICATE KEY UPDATE total_amount=VALUES(total_amount);

-- 4. Insert Order Items for Past Orders
INSERT INTO order_items (id, order_id, product_id, product_name, product_image, unit_price, quantity, subtotal) VALUES
(1, 101, 2, 'Apple Watch Series 9 GPS 45mm', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80', 399.00, 1, 399.00),
(2, 101, 4, 'Minimalist Leather Backpack', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80', 80.49, 1, 80.49),
(3, 102, 1, 'Sony WH-1000XM5 Wireless Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', 349.99, 1, 349.99),
(4, 103, 4, 'Minimalist Leather Backpack', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80', 89.99, 1, 89.99)
ON DUPLICATE KEY UPDATE subtotal=VALUES(subtotal);
