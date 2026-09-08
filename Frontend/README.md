# Inventory Management System — Frontend Client

Modern, responsive Single Page Application (SPA) built with **React**, **Vite**, and **Axios** following clean modular component and service layer patterns.

---

## 🚀 Features

- **Authentication & Security:** User registration, login, logout, and token persistence with automatic JWT Bearer injection and route protection (`<ProtectedRoute />`).
- **Dashboard Overview:** Real-time metrics for total products, categories, aggregate stock quantity, low-stock warnings, and out-of-stock items.
- **Product Management:** Full CRUD with search (Name/SKU), category filtering, status filtering, multi-field sorting, and pagination.
- **Category Management:** Create, edit, and delete categories with product count association.
- **Stock Management:** Increase and reduce stock levels with validation (preventing negative inventory) and transaction audit timeline.
- **User Experience:** Responsive drawer navigation for desktop/tablet/mobile, loading spinners, empty states, and toast notifications.

---

## 📁 Folder Structure

```text
Frontend/
│
├── public/                     # Static assets (favicons, icons)
│
├── src/
│   ├── assets/                 # SVGs and images
│   │
│   ├── components/             # Reusable UI components
│   │   ├── common/             # LoadingSpinner, Modal, Pagination, EmptyState, StatusBadge
│   │   ├── layout/             # MainLayout, Sidebar, Header
│   │   ├── dashboard/          # StatCard
│   │   ├── categories/         # CategoryModal
│   │   └── inventory/          # StockModal
│   │
│   ├── pages/                  # Top-level route pages
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── AddProduct.jsx
│   │   ├── EditProduct.jsx
│   │   ├── Categories.jsx
│   │   └── NotFound.jsx
│   │
│   ├── services/               # API Service Layer (Axios)
│   │   ├── api.js              # Centralized Axios instance with auth interceptor
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   ├── category.service.js
│   │   ├── inventory.service.js
│   │   └── dashboard.service.js
│   │
│   ├── context/                # Global React state
│   │   ├── AuthContext.jsx     # User session & auth state
│   │   └── NotificationContext.jsx # Toast alerts
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.js
│   │   └── useNotification.js
│   │
│   ├── routes/
│   │   └── ProtectedRoute.jsx  # Auth guard component
│   │
│   ├── utils/
│   │   └── constants.js        # API endpoints & stock status rules
│   │
│   ├── App.jsx                 # Application routes & providers
│   ├── App.css                 # Component & layout stylesheet
│   ├── index.css               # Design tokens & typography
│   └── main.jsx                # DOM entry point
│
├── .env                        # Local environment variables
├── .env.example                # Template environment variables
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## ⚙️ Environment Configuration

Ensure `.env` exists in `Frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🛠️ Installation & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```
