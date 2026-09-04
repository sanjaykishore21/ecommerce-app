# 🛍️ AURORA | Full-Stack E-Commerce Application

A modern, responsive, full-stack **E-Commerce Web Application** built with **Java Spring Boot 3**, **Spring Security + JWT**, **MySQL**, and a sleek **React 18 + Vite** frontend.

---

## 🌟 Overview & Key Features

### 🛒 Customer Experience
- **Product Catalog**: Browse curated products across categories (*Electronics, Wearables, Gaming, Accessories, Furniture, Kitchen, Lifestyle*).
- **Search & Filter**: Real-time keyword search, category filtering, and sorting by price/name.
- **Product Quick View**: Modal popup with high-resolution images, specifications, and instant stock indicators.
- **Interactive Cart**: Real-time quantity adjusters, subtotal calculations, free shipping threshold progress bar, and slide-out cart drawer.
- **Seamless Checkout**: Shipping address management, payment method selection (*Card, UPI, Cash on Delivery*), and atomic inventory verification.
- **Live Order Tracking**: Visual step tracker (`PENDING` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`), itemized receipts, and order history.

### 🛡️ Store Administration (Admin)
- **Inventory Management**: Full CRUD operations—add new items with real-time image previews, edit stock/pricing, and delete products.
- **Order Fulfillment Dashboard**: View all customer orders, filter by status, and update shipment progress in real-time.
- **Store Metrics**: Real-time stats for total catalog items, low-stock warnings, gross revenue, and pending orders.

### 🔐 Security & Architecture
- **Stateless JWT Authentication**: Secure Bearer tokens with BCrypt password hashing.
- **Role-Based Access Control**: Strict segregation between `ROLE_USER` and `ROLE_ADMIN` endpoints.
- **Centralized Error Handling**: Standardized JSON responses for validation failures, stock shortages, and unauthorized requests.
- **Auto Database Seeder**: Automatically creates tables and seeds demo accounts and catalog items on startup.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite, Lucide Icons, Custom Glassmorphism CSS Design System |
| **Backend** | Java 17+, Spring Boot 3.2.x, Spring Data JPA, Spring Security, JJWT 0.11.5, Jakarta Validation, Lombok |
| **Database** | MySQL 8.0 / Embedded MySQL-mode Database |
| **DevOps & Containers** | Docker, Docker Compose, Multi-stage Builds |

---

## 👥 Demo Accounts (Pre-Configured)

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Store Admin** | `admin@ecommerce.com` | `admin123` | Admin Dashboard, Product CRUD, Order Status Management |
| **Customer** | `user@ecommerce.com` | `user123` | Browse Catalog, Manage Cart, Checkout, Live Order Tracking |

> **Tip**: The login page includes **⚡ 1-Click Fast Fill** buttons to instantly test both roles.

---

## 📂 Project Structure

```
ecommerce/
├── backend/                               # Spring Boot 3 Backend
│   ├── Dockerfile                         # Production multi-stage Dockerfile
│   ├── pom.xml                            # Maven dependencies & plugins
│   ├── src/main/java/com/ecommerce/app/
│   │   ├── EcommerceApplication.java      # Application entry point
│   │   ├── config/                        # SecurityConfig, JwtTokenProvider, DataInitializer
│   │   ├── controller/                    # Auth, Product, Cart, and Order REST Controllers
│   │   ├── dto/                           # Request/Response payloads & ApiResponse wrapper
│   │   ├── entity/                        # User, Product, CartItem, Order, OrderItem
│   │   ├── exception/                     # GlobalExceptionHandler, Custom Exceptions
│   │   ├── repository/                    # JPA Data Repositories
│   │   └── service/                       # Business logic & Transactional services
│   └── src/main/resources/
│       ├── application.properties         # Dynamic cloud & local configuration
│       └── schema.sql                     # Database schema definitions
├── frontend/                              # React 18 Single Page App
│   ├── Dockerfile                         # Production Nginx Dockerfile
│   ├── vercel.json                        # Single Page App routing rewrite configuration
│   ├── package.json                       # Dependencies & build scripts
│   ├── vite.config.js                     # Vite bundler configuration
│   └── src/
│       ├── App.jsx                        # Root navigation router
│       ├── index.css                      # Custom dark glassmorphic design system
│       ├── components/                    # Navbar, Footer, ProductCard, ProductModal, CartDrawer, Toast
│       ├── pages/                         # Shop, Checkout, Orders, AdminProducts, AdminOrders, Auth
│       ├── context/                       # AuthContext, CartContext
│       └── services/api.js                # REST API client with URL normalizer
├── database/
│   ├── schema.sql                         # Standalone MySQL schema
│   └── seed-data.sql                      # Demo products and orders seed script
├── docker-compose.yml                     # 1-Click local MySQL container
└── README.md
```

---

## 💻 Running Locally

### Prerequisites
- **Java 17+**
- **Node.js 18+**
- **Maven** *(or use the included `mvnw` wrapper)*

### 1. Start the Backend
```bash
cd backend
./mvnw spring-boot:run
```
*(On Windows: `mvnw.cmd spring-boot:run` or run `backend/start.bat`)*  
Backend runs on: **`http://localhost:8080`**

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*(On Windows: run `frontend/start.bat`)*  
Frontend runs on: **`http://localhost:5173`**

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (`ROLE_USER` or `ROLE_ADMIN`) | Public |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT Bearer Token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | User / Admin |

### 📦 Products (`/api/products`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/products` | Retrieve catalog (supports `?category=...&search=...`) | Public |
| `GET` | `/api/products/{id}` | Get product details by ID | Public |
| `GET` | `/api/products/categories`| List all distinct product categories | Public |
| `POST` | `/api/products` | Create a new product | Admin |
| `PUT` | `/api/products/{id}` | Update product information, price, or stock | Admin |
| `DELETE` | `/api/products/{id}` | Delete a product | Admin |

### 🛒 Shopping Cart (`/api/cart`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/cart` | Get current user's cart items and total | Authenticated |
| `POST` | `/api/cart/items` | Add product to cart (`productId`, `quantity`) | Authenticated |
| `PUT` | `/api/cart/items/{id}`| Update cart item quantity (`?quantity=...`) | Authenticated |
| `DELETE`| `/api/cart/items/{id}`| Remove specific item from cart | Authenticated |
| `DELETE`| `/api/cart/clear` | Clear all items from cart | Authenticated |

### 📋 Orders (`/api/orders`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/orders/checkout`| Atomic checkout: decrements stock & creates order | Authenticated |
| `GET` | `/api/orders/my-orders`| Retrieve order history for current user | Authenticated |
| `GET` | `/api/orders/{id}` | Retrieve specific order details | Authenticated |
| `GET` | `/api/orders/admin/all`| View all system orders (`?status=...`) | Admin |
| `PUT` | `/api/orders/admin/{id}/status`| Update order fulfillment status | Admin |

---

## ⚙️ Environment Variables

### Backend (`backend/src/main/resources/application.properties` or OS Environment)
| Variable | Description | Default |
|---|---|---|
| `PORT` | Server listening port | `8080` |
| `JWT_SECRET` | Secret key for signing JWT tokens | Pre-configured secure key |
| `SPRING_DATASOURCE_URL` | JDBC Connection URL | Auto-configured (Embedded / MySQL) |
| `SPRING_DATASOURCE_USERNAME` | Database username | `root` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | `root` |

### Frontend (`frontend/.env` or Hosting Environment)
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend REST API (e.g. `http://localhost:8080/api`) |

---

## website link
(https://frontend-m7xm7hgpb-sanjaykishore228-7818s-projects.vercel.app/)
