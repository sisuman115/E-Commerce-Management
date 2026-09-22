# E-Commerce Management Platform

A full-stack e-commerce management platform built using **Java Spring Boot** and **React.js**.

The application provides separate experiences for **customers** and **administrators**, including product browsing, shopping cart, checkout, order management, reviews, wishlist, address management, inventory tracking, and administrative dashboards.

---

## 🚀 Features

### 👤 Authentication & Authorization

- Customer registration and login
- Secure password hashing using BCrypt
- JWT-based authentication
- Stateless authentication with Spring Security
- Role-based authorization
- Two roles:
  - `ADMIN`
  - `CUSTOMER`

### 🛍️ Customer Features

- Browse products
- Search products by name
- Filter products by category
- View product details
- Product ratings and reviews
- Add products to wishlist
- Remove products from wishlist
- View wishlist
- Add products to cart
- Update cart quantities
- Remove cart items
- Stock availability validation
- Manage delivery addresses
- Select address during checkout
- Place orders
- View order history
- View individual order details
- Track order status
- Cancel eligible orders
- Customer dashboard
- View spending statistics

### 📦 Product Management

- Create products
- Update products
- Delete products
- Update product stock
- Product image support
- Product descriptions
- Product pricing
- Low-stock threshold
- Low-stock detection
- Category association
- Product search
- Product rating summary
- Wishlist count

### 🗂️ Category Management

- Create categories
- Update categories
- Delete categories
- View all categories
- Product count per category
- Prevent deletion of categories that are currently being used by products

### 📋 Order Management

- Create orders from cart
- Address snapshot during checkout
- Order items
- Automatic stock reduction when an order is placed
- Order status management
- Supported order statuses:

```text
PLACED
CONFIRMED
SHIPPED
DELIVERED
CANCELLED
```

- Stock restoration when an eligible order is cancelled
- Customer order history
- Admin order management
- Order statistics

### ⭐ Reviews & Ratings

- Customers can submit product reviews
- Product ratings
- Average product rating
- Review count
- Rating distribution

### ❤️ Wishlist

- Add products to wishlist
- Remove products from wishlist
- Check whether a product is already wishlisted
- Wishlist item count

### 📊 Inventory & Stock Management

- Initial stock tracking
- Admin stock adjustments
- Stock changes during product updates
- Stock reduction after orders
- Stock restoration after cancellations
- Stock movement history
- Low-stock product detection

### 👨‍💼 Admin Features

- Admin dashboard
- Product management
- Category management
- User management
- Order management
- Stock management
- Low-stock products
- Revenue statistics
- Monthly revenue
- Product revenue statistics
- Customer spending statistics
- Customer order statistics
- Customer order status statistics

---

## 🛠️ Tech Stack

### Backend

- Java 25
- Spring Boot 4.1.1
- Spring WebMVC
- Spring Data JPA
- Spring Security
- JWT
- BCrypt
- MySQL
- Maven
- Bean Validation

### Frontend

- React.js
- JavaScript
- Vite
- React Router
- Axios
- Bootstrap
- Context API

### Database

- MySQL

---

## 🏗️ Project Structure

```text
E-Commerce-Management/
│
├── backend/
│   └── ecommerce-management/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/
│       │   │   │   └── com/ecommerce/ecommerce_management/
│       │   │   │       ├── controller/
│       │   │   │       ├── dto/
│       │   │   │       ├── entity/
│       │   │   │       ├── exception/
│       │   │   │       ├── repository/
│       │   │   │       ├── security/
│       │   │   │       └── service/
│       │   │   │
│       │   │   └── resources/
│       │   │       └── application.properties
│       │   │
│       │   └── test/
│       │
│       ├── pom.xml
│       ├── mvnw
│       └── mvnw.cmd
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🔐 Security

The application uses:

- Spring Security
- JWT authentication
- BCrypt password hashing
- Role-based access control
- Stateless sessions
- Protected REST APIs
- Environment variables for sensitive configuration

Sensitive credentials are **not stored directly in the source code**.

The backend uses environment variables for:

```properties
DB_USERNAME
DB_PASSWORD
ECOMMERCE_JWT_SECRET
JWT_EXPIRATION
```

---

## ⚙️ Backend Setup

### 1. Requirements

Make sure the following are installed:

- Java 25
- Maven
- MySQL
- Node.js and npm

### 2. Create the database

Create a MySQL database:

```sql
CREATE DATABASE ecommerce_db;
```

### 3. Configure environment variables

The backend expects the following environment variables:

```text
DB_USERNAME
DB_PASSWORD
ECOMMERCE_JWT_SECRET
JWT_EXPIRATION
```

Example:

```text
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
ECOMMERCE_JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRATION=3600000
```

Do not commit actual credentials to GitHub.

### 4. Run the backend

Navigate to:

```text
backend/ecommerce-management
```

Then run:

```bash
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

---

## 💻 Frontend Setup

Navigate to:

```text
frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## 🔄 Application Flow

### Customer Flow

```text
Register / Login
       ↓
Browse Products
       ↓
Search / Filter
       ↓
View Product
       ↓
Add to Wishlist / Cart
       ↓
Manage Cart
       ↓
Select Address
       ↓
Checkout
       ↓
Place Order
       ↓
Track Order
       ↓
Review Product
```

### Admin Flow

```text
Admin Login
     ↓
Admin Dashboard
     ↓
Manage Categories
     ↓
Manage Products
     ↓
Manage Stock
     ↓
Manage Users
     ↓
Manage Orders
     ↓
View Statistics
```

---

## 🔒 Role-Based Access

| Feature              | Customer | Admin |
| -------------------- | :------: | :---: |
| Browse Products      |    ✅    |  ✅   |
| Search Products      |    ✅    |  ✅   |
| View Product Details |    ✅    |  ✅   |
| Cart                 |    ✅    |   —   |
| Wishlist             |    ✅    |   —   |
| Checkout             |    ✅    |   —   |
| Manage Addresses     |    ✅    |   —   |
| View Own Orders      |    ✅    |   —   |
| Submit Reviews       |    ✅    |   —   |
| Customer Dashboard   |    ✅    |   —   |
| Product Management   |    —     |  ✅   |
| Category Management  |    —     |  ✅   |
| User Management      |    —     |  ✅   |
| Order Management     |    —     |  ✅   |
| Stock Management     |    —     |  ✅   |
| Admin Dashboard      |    —     |  ✅   |
| Revenue Statistics   |    —     |  ✅   |

---

## 📡 Main Backend Modules

The backend is organized into:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Main modules include:

- Authentication
- Users
- Products
- Categories
- Cart
- Orders
- Addresses
- Reviews
- Wishlist
- Stock Movement
- Admin Dashboard
- Customer Dashboard

---

## 🧪 Validation & Error Handling

The backend includes:

- Request validation using Bean Validation
- Global exception handling
- Resource-not-found handling
- Stock validation
- Duplicate email validation
- Duplicate category validation
- Product deletion protection
- Category deletion protection
- Cart quantity validation
- Order stock validation

---

## 📱 Responsive Frontend

The React frontend is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

Bootstrap is used for responsive layouts, while custom CSS provides the application's visual styling, cards, buttons, navigation, animations, and responsive behavior.

---

## 🎯 Project Goals

This project was developed to practice and demonstrate:

- Java programming
- Spring Boot application development
- REST API development
- Spring Security
- JWT authentication
- Role-based authorization
- JPA and Hibernate
- MySQL database integration
- CRUD operations
- React.js development
- React Router
- Axios API integration
- Bootstrap
- State management
- Form validation
- Error handling
- Full-stack application integration

---

## 👨‍💻 Author

**Suman**

B.E. Computer Science and Engineering

### Technologies

```text
Java
Spring Boot
Spring Security
JWT
MySQL
React.js
JavaScript
HTML5
CSS3
Bootstrap
```

---

## 📌 Project Status

**Completed**

The project includes a working Spring Boot REST API, MySQL database integration, JWT authentication, role-based authorization, and a React frontend with customer and administrator functionality.
