# 🛍️ AURORA | Full-Stack E-Commerce Web Application

A modern, responsive, and robust full-stack **E-Commerce Web Application** built with **Java Spring Boot 3**, **Spring Security + JWT**, **MySQL**, and a responsive **React** frontend.

---

## 🚀 Key Features

### 🛒 Customer Experience (User)
- **Product Catalog**: Browse products with categories (Electronics, Wearables, Gaming, Accessories, Furniture, Kitchen, Lifestyle), keyword search, price sorting, and live stock indicators.
- **Product Details Modal**: Full description, high-resolution preview, and quantity picker.
- **Interactive Shopping Cart**: Live quantity adjusters, dynamic subtotal calculations, free shipping threshold progress bar, and slide-out cart drawer.
- **Seamless Checkout**: Address management, payment method selector (Credit Card, UPI, Cash on Delivery), real-time pricing verification, and atomic stock decrement.
- **Order Tracking & History**: Visual timeline tracker (`PENDING` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`), line-item breakdown, and order receipts.

### 🛡️ Store Administration (Admin)
- **Product Management**: Full CRUD operations—add new items with image preview, edit stock and prices, and delete products.
- **Order Fulfillment**: Overview of all customer orders, filter by status, and 1-click status updater dropdown (e.g. advance from `PENDING` to `SHIPPED`).
- **Inventory Metrics**: Real-time stats for total catalog items, low-stock alerts, out-of-stock items, gross revenue, and pending orders.

### 🔐 Security & Validation
- **Authentication**: Stateless JWT token authentication with BCrypt password hashing.
- **Role-Based Access Control**: Strict segregation between `ROLE_USER` and `ROLE_ADMIN` endpoints.
- **Validation & Exception Handling**: Centralized `GlobalExceptionHandler` returning consistent JSON responses for validation errors, insufficient stock, and unauthorized requests.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Java 17+, Spring Boot 3.2.x, Spring Data JPA, Spring Security, JJWT 0.11.5, Jakarta Validation, Lombok |
| **Frontend** | React 18, Vite, Lucide Icons, Custom Vanilla CSS Design System (Glassmorphism, Dark Mode) |
| **Database** | MySQL 8.0 (InnoDB, utf8mb4) |
| **DevOps** | Docker Compose (optional 1-click MySQL startup) |

---

## 👥 Demo Accounts (Pre-configured)

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@ecommerce.com` | `admin123` | Full Admin Dashboard, Product CRUD, Order Status Management |
| **Customer** | `user@ecommerce.com` | `user123` | Browse Catalog, Manage Cart, Checkout, View Order Tracking |

> **Tip**: The frontend login page includes **⚡ 1-Click Fast Fill** buttons to instantly test both roles!

---

## 📂 Project Structure

```
ecommerce/
├── backend/                               # Spring Boot Application
│   ├── pom.xml                            # Maven dependencies
│   ├── src/main/java/com/ecommerce/app/
│   │   ├── EcommerceApplication.java      # Application entrypoint
│   │   ├── config/                        # SecurityConfig, JwtTokenProvider, DataInitializer
│   │   ├── controller/                    # Auth, Product, Cart, Order Controllers
│   │   ├── dto/                           # Request/Response payloads & ApiResponse
│   │   ├── entity/                        # User, Product, CartItem, Order, OrderItem
│   │   ├── exception/                     # GlobalExceptionHandler, Custom Exceptions
│   │   ├── repository/                    # JPA Spring Data Repositories
│   │   └── service/                       # Business logic & Transactions
│   └── src/main/resources/
│       ├── application.properties         # MySQL connection, JPA, JWT secrets
│       ├── schema.sql                     # Fallback schema DDL
│       └── data.sql                       # Fallback seed data
├── frontend/                              # React Single Page App
│   ├── package.json                       # Scripts and dependencies
│   ├── vite.config.js                     # Vite build & backend proxy setup
│   ├── index.html                         # HTML entry with Google fonts
│   └── src/
│       ├── App.jsx                        # Main layout & router
│       ├── index.css                      # Design system & theme styles
│       ├── components/                    # Navbar, Footer, ProductCard, ProductModal, CartDrawer, Toast
│       ├── pages/                         # Shop, Checkout, Orders, AdminProducts, AdminOrders, Auth
│       ├── context/                       # AuthContext, CartContext
│       └── services/api.js                # REST API client
├── database/                              # Database Initialization
│   ├── schema.sql                         # MySQL table definitions
│   └── seed-data.sql                      # Demo products and initial orders
├── docker-compose.yml                     # 1-Click MySQL container
└── README.md
```

---

## ⚡ Quick Start Guide

### Step 1: Start the MySQL Database

#### Option A: Using Docker (Fastest)
Run the included `docker-compose.yml`:
```bash
docker compose up -d
```
*This will spin up a MySQL 8 container on port `3306` and automatically initialize `ecommerce_db` with sample products and demo users.*

#### Option B: Using Local MySQL Server
1. Open your MySQL client (MySQL Workbench, phpMyAdmin, or CLI) and execute:
   ```sql
   SOURCE database/schema.sql;
   SOURCE database/seed-data.sql;
   ```
2. Verify credentials in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=root
   ```

---

### Step 2: Run the Spring Boot Backend

Navigate to the `backend` folder and start the server:

```bash
cd backend
mvn spring-boot:run
```

The REST API will be available at: **`http://localhost:8080`**

*(Note: On first startup, `DataInitializer.java` will automatically verify and seed any missing demo users and catalog products).*

---

### Step 3: Run the Frontend Application

Open a new terminal window, navigate to the `frontend` folder, install dependencies, and run the development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at: **`http://localhost:5173`**

---

## 📡 Backend REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (`ROLE_USER` or `ROLE_ADMIN`) | Public |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT Bearer Token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | User / Admin |

### 📦 Products (`/api/products`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/products` | Get products (query params: `?category=...&search=...`) | Public |
| `GET` | `/api/products/{id}` | Get product details by ID | Public |
| `GET` | `/api/products/categories`| List all distinct product categories | Public |
| `POST` | `/api/products` | Create a new product | Admin (`ROLE_ADMIN`) |
| `PUT` | `/api/products/{id}` | Update product information, price, or stock | Admin (`ROLE_ADMIN`) |
| `DELETE` | `/api/products/{id}` | Delete a product | Admin (`ROLE_ADMIN`) |

### 🛒 Shopping Cart (`/api/cart`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/cart` | Get current user's cart items and total | User (`ROLE_USER`) |
| `POST` | `/api/cart/items` | Add product to cart (`productId`, `quantity`) | User (`ROLE_USER`) |
| `PUT` | `/api/cart/items/{id}`| Update cart item quantity (`?quantity=...`) | User (`ROLE_USER`) |
| `DELETE`| `/api/cart/items/{id}`| Remove specific item from cart | User (`ROLE_USER`) |
| `DELETE`| `/api/cart/clear` | Clear all items from cart | User (`ROLE_USER`) |

### 📋 Orders (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/orders/checkout`| Atomic checkout: decrements stock & creates order | User (`ROLE_USER`) |
| `GET` | `/api/orders/my-orders`| Retrieve order history for current user | User (`ROLE_USER`) |
| `GET` | `/api/orders/{id}` | Retrieve specific order details | User / Admin |
| `GET` | `/api/orders/admin/all`| View all system orders (`?status=...`) | Admin (`ROLE_ADMIN`) |
| `PUT` | `/api/orders/admin/{id}/status`| Update order fulfillment status | Admin (`ROLE_ADMIN`) |

---

## 🧪 Testing the Application Flows

1. **User Shopping Flow**:
   - Log in using the **User Demo** (`user@ecommerce.com` / `user123`).
   - Browse catalog products, filter by categories (e.g. *Gaming*, *Wearables*), or search for *"Headphones"*.
   - Click **Add to Cart** or view the **Product Details Modal**.
   - Open the slide-out Cart Drawer and proceed to **Checkout**.
   - Complete checkout with shipping address and payment method.
   - Go to **My Orders** to track the live status timeline!

2. **Admin Management Flow**:
   - Log in using the **Admin Demo** (`admin@ecommerce.com` / `admin123`).
   - Click **Manage Products** in the navigation bar to add, edit stock, or delete items.
   - Click **Manage Orders** to view customer orders and advance the status from `PENDING` to `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`.

---

## 📄 License
This project is licensed under the MIT License.
