# Inventory Management System - Backend API

A robust, modular, and scalable RESTful API built with **Node.js (ES Modules)**, **Express.js**, **MongoDB**, and **Mongoose** following the **Service-Layer Architecture (Routes → Middleware → Controllers → Services → Models → MongoDB)**.

---

## 🏛 Architecture Overview

```
Client Request
      ↓
    Routes (API Endpoint Definitions)
      ↓
  Middleware (Authentication, Validation, Error Handling)
      ↓
  Controllers (Request/Response Orchestration - Thin Layer)
      ↓
   Services (Core Business Logic & Transactions)
      ↓
    Models (Mongoose Schemas & Database Constraints)
      ↓
  MongoDB (Local Database)
```

### Key Architectural Principles
- **Modern ES Modules:** Entire codebase uses standardized `import`/`export` syntax.
- **Thin Controllers:** Controllers only handle HTTP status codes, request parsing, and passing data to services.
- **Service Layer Pattern:** All business logic, stock status calculations, data manipulations, and queries reside cleanly within services.
- **Strict Authentication & Security:** Protected routes strictly enforce JWT Bearer token authentication via `protect` middleware. Passwords are encrypted with `bcryptjs`.
- **Modular Design:** Self-contained modules for Authentication, Products, Categories, Inventory Management, and Dashboard Analytics.
- **Centralized Error Handling:** Consistent API responses with standard HTTP error codes.

---

## 📁 Directory Structure

```
Backend/
│
├── src/
│   ├── config/
│   │   └── db.js                       # Database connection setup
│   │
│   ├── models/                         # Mongoose Models & Schemas
│   │   ├── User.js                     # User schema (auth, roles, bcrypt hooks)
│   │   ├── Product.js                  # Product schema (SKU, price, stock)
│   │   ├── Category.js                 # Category schema
│   │   └── InventoryTransaction.js     # Stock audit & transaction logs
│   │
│   ├── controllers/                    # HTTP Controllers (Thin)
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── inventory.controller.js
│   │   └── dashboard.controller.js
│   │
│   ├── services/                       # Business Logic Layer
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   ├── category.service.js
│   │   ├── inventory.service.js
│   │   └── dashboard.service.js
│   │
│   ├── routes/                         # Express Route Definitions
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── category.routes.js
│   │   ├── inventory.routes.js
│   │   └── dashboard.routes.js
│   │
│   ├── middleware/                     # Custom Middleware
│   │   ├── auth.middleware.js          # JWT Verification & RBAC
│   │   ├── validation.middleware.js    # Schema validation handler
│   │   └── error.middleware.js         # Centralized error & 404 handler
│   │
│   ├── validators/                     # Request Validation Schemas
│   │   ├── auth.validator.js
│   │   ├── product.validator.js
│   │   └── category.validator.js
│   │
│   ├── utils/                          # Helper Utilities
│   │   ├── generateToken.js            # JWT Token creation
│   │   ├── stockStatus.js              # Automatic stock status evaluator
│   │   └── response.js                 # Unified API response formatter
│   │
│   ├── constants/                      # Enums & Constants
│   │   └── index.js
│   │
│   └── server.js                       # Express Application Entry Point
│
├── .env                                # Local Environment Variables
├── .env.example                        # Template Environment Variables
├── .gitignore                          # Git Ignore Configuration
├── package.json                        # Project Metadata & Dependencies ("type": "module")
└── README.md                           # Documentation
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root `Backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/inventory_management
JWT_SECRET=change_this_to_a_secure_secret
JWT_EXPIRES_IN=7d
```

---

## 🔐 Authentication Workflow

1. **Registration (`POST /api/auth/register`):**
   - User submits `name`, `email`, and `password`.
   - Server validates credentials, hashes password with `bcryptjs`, saves user in MongoDB, and issues a JWT token.
2. **Login (`POST /api/auth/login`):**
   - User submits `email` and `password`.
   - Server verifies credentials against the stored hash and returns a valid JWT token.
3. **Protected Routes (e.g., `GET /api/auth/me`):**
   - Client **must** pass the token in header: `Authorization: Bearer <token>`.
   - Missing or invalid tokens result in `401 Unauthorized`.
4. **Logout (`POST /api/auth/logout`):**
   - Stateless JWT logout requires the client application to remove the token from its local/session storage.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local MongoDB
Ensure your local MongoDB service is running at:
`mongodb://127.0.0.1:27017`

### 3. Run the Server
- **Development Mode (with Nodemon):**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  ```bash
  npm start
  ```
