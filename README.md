# E-MART: Full-Stack E-Commerce Ecosystem

A sophisticated, modern MERN-stack e-commerce platform featuring a customer-facing storefront and a comprehensive administrative dashboard. Built with performance, security, and developer experience in mind.

## 📄 Detailed Overview

**E-MART** is a complete e-commerce solution designed to handle the full lifecycle of online shopping. It leverages **Clerk** for robust user authentication and **Stripe** for secure payment processing. The project is split into three primary modules:
1.  **Backend (API Server):** A centralized Node.js/Express service managing data and business logic.
2.  **Frontend (Storefront):** A React-based application for customers to browse, cart, and buy products.
3.  **Admin Panel:** A dedicated Vite-powered dashboard for store managers to monitor performance and manage inventory.

---

## ✨ Features

### 🛍️ Customer Storefront
-   **Apparel-First Discovery:** Interactive listing with clothing-specific filtering (Size, Color, Gender, Brand).
-   **Advanced Product Details:** Interactive variant selector with real-time stock feedback.
-   **Multi-Image Gallery:** High-definition image carousels for comprehensive product inspection.
-   **Sizing Feedback:** Community-driven reviews with 'Fit' metrics (Perfect, Loose, Tight).
-   **Shopping Cart:** Real-time, variant-aware cart management powered by Redux.
-   **Secure Checkout:** Integrated Stripe payment gateway with order snapshot persistence.
-   **Sticky Navigation:** Persistent navbar and premium footer for seamless site traversal.

### 🛠️ Administrative Dashboard
-   **Dynamic Variant Builder:** Add/Edit/Delete sizes and colors with granular stock control.
-   **Batch Image Management:** Multi-file upload support for professional product galleries.
-   **Intelligence Filters:** Refine inventory views by category, brand, and gender.
-   **High-Density Logistics:** Detailed listing tables with variant counts and color summaries.
-   **Business Analytics:** Visualized sales and order data using Recharts.
-   **Order Tracking:** Monitor and update status for all customer orders.
-   **User Management:** View registered users and their details.

---

## 🚀 Tech Stack

### Frontend & UI
-   **Framework:** React 19
-   **State Management:** Redux (Global Cart state)
-   **Routing:** React Router v7
-   **Styling:** Bootstrap 5, Font-Awesome
-   **Auth:** Clerk React SDK
-   **Payments:** Stripe JS / React-Stripe

### Backend (Server-Side)
-   **Runtime:** Node.js
-   **Framework:** Express.js (v5)
-   **Database:** MongoDB via Mongoose
-   **File Management:** Multer (Local storage)
-   **Authentication:** Clerk Node SDK & JsonWebToken (JWT)
-   **Utils:** Express Async Handler, CORS, Dotenv

### Admin Dashboard
-   **Bundler:** Vite
-   **CSS Framework:** Tailwind CSS
-   **Icons:** Lucide React
-   **Charts:** Recharts

---

## 📂 Project Structure

```text
emart-react-website/
├── backend/                # Express API Server
│   ├── config/             # DB & External service configs
│   ├── controllers/        # Request handlers (Business Logic)
│   ├── middlewares/        # Auth guards & Error handling
│   ├── models/             # Mongoose Schemas (Product, Order, etc.)
│   ├── routes/             # API Endpoints
│   └── uploads/            # Static storage for product images
├── frontend/               # Customer React Application
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # Reusable UI & Page components
│       ├── redux/          # Actions & Reducers (Cart state)
│       └── services/       # API interaction layer
└── admin-panel/            # Administrative Vite Application
    ├── src/
    │   ├── pages/          # Admin Dashboard, Products, Orders
    │   └── components/     # Dashboard widgets & Layouts
```

---

## ⚙️ How It Works (Internal Data Flow)

1.  **Request Lifecycle:** The frontend (React) communicates with the Backend via **Axios**. All requests are directed to the `/api` namespace.
2.  **Authentication Flow:**
    -   Frontenders use **Clerk** for JWT issuance.
    -   The Backend `authMiddleware` validates tokens against the Clerk API or local JWT secret.
    -   Admin access is restricted via `verifyAdminToken` middleware.
3.  **State Logic:**
    -   **Cart:** Managed locally via Redux for speed, then synced to the `Cart` model in MongoDB for persistence.
    -   **Products:** Fetched directly from MongoDB; cached in component state for immediate UI response.
4.  **Order Processing:**
    -   User initiates checkout -> Backend creates a payment intent.
    -   Successful payment triggers `Order` creation in MongoDB and stock reduction in `Product` documents.
5.  **Image Handling:** Frontend sends `FormData` -> `Multer` saves to `/uploads` -> URL is stored in the database.

---

## 🛠️ Installation & Setup

### Prerequisites
-   Node.js (v18+)
-   MongoDB Atlas account or local instance
-   Clerk Account (for Auth)
-   Stripe Account (for Payments)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file based on existing config:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   CLERK_SECRET_KEY=your_clerk_secret
   JWT_SECRET=your_jwt_secret
   ```
4. `npm run seed` (Optional: seed dummy data)
5. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Configure `.env`:
   ```env
   REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_key
   REACT_APP_STRIPE_KEY=your_stripe_key
   ```
4. `npm start`

### Admin Panel Setup
1. `cd admin-panel`
2. `npm install`
3. `npm run dev`

---

## 📡 API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/products` | Fetch filtered clothing items | Public |
| **POST** | `/api/products` | Create variant-aware product | Admin |
| **POST** | `/api/orders/place` | Submit order with product snapshots | User |
| **POST** | `/api/upload/multiple` | Batch upload product images | Admin |
| **POST** | `/api/reviews/:id` | Submit review with 'Fit' feedback | User |

---

## 🔮 Future Improvements
-   **Cloudinary Integration:** Migrate local Multer storage to Cloudinary for global CDN delivery.
-   **Search Optimization:** Implement MongoDB Atlas Search for fuzzy matching on brands/names.
-   **Email Notifications:** Integrate SendGrid for order and shipping confirmations.
-   **Inventory Alerts:** Dashboard notifications when specific variants fall below threshold.

## 🐛 Known Issues
-   Admin Panel login requires specific hardcoded credentials if not synced with Clerk metadata yet.
-   Mobile navigation menu transition may lag on older Safari versions.

---

## 🏁 Conclusion
E-MART represents a robust, production-ready foundation for digital commerce. By combining modern frameworks with industry-standard services like Clerk and Stripe, it ensures security and scalability for both customers and administrators.

---
*Created with ❤️ by Antigravity*
