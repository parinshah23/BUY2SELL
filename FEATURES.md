# 🛒 Buy2Sell Marketplace - Features Overview

Welcome to **Buy2Sell**, a feature-rich C2C (Customer-to-Customer) marketplace platform. This document outlines all the functionalities currently implemented.

---

## 🔐 User Authentication & Profile
*   **Sign Up / Login**: Secure authentication using JWT (JSON Web Tokens).
*   **Profile Management**:
    *   Update Name, Bio, and Avatar.
    *   Manage **Multiple Shipping Addresses** (Set default address).
    *   View Account details.
*   **Wishlist**: Save favorite products for later.

## 📦 Product Management
*   **Browse Products**: View all listings with robust filtering (Price, Category, Newest).
*   **Search**: Real-time search by title or keyword.
*   **Product Details**: High-quality image gallery, detailed description, location, and seller info.
*   **Stock Management**:
    *   Sellers can define **Stock Quantity**.
    *   Automatic stock decrement upon sale.
    *   "Out of Stock" labels displayed when inventory hits zero.
*   **Sell a Product**:
    *   Upload up to 5 images.
    *   Set title, description, category, price, stock, and location.
*   **My Products Dashboard**:
    *   View analytics for your listings.
    *   Edit or Delete your products.

## 💳 Buying & Payments
*   **Secure Checkout**: Integrated **Stripe** payment gateway.
*   **Order History**: View all past purchases with status (Paid, Shipped, Delivered).
*   **Order Tracking**: Track the status of your orders.

## 💰 Seller Wallet & Earnings
*   **Wallet Dashboard**: Real-time tracking of:
    *   **Total Earnings**: Money earned from sales (minus platform fees).
    *   **Pending Balance**: Money held in escrow until order completion.
    *   **Available for Withdrawal**: Funds ready to be paid out.
*   **Transaction History**: Detailed log of every sale and withdrawal.
*   **Withdraw Funds**: Request payouts to your bank account (simulated).

## 🛡️ Trust & Safety
*   **Secure Chat**: Real-time messaging between Buyer and Seller.
    *   **Image Support**: Send photos within chat (e.g., product condition proof).
    *   **Read Receipts**: See when messages are read.
*   **User Safety Controls**:
    *   **Block User**: Prevent specific users from messaging you.
    *   **Report User**: Report suspicious behavior to admins.
    *   All chats are isolated per product to prevent spam.

---

## 🛠️ Tech Stack
*   **Frontend**: Next.js 14, TailwindCSS, Framer Motion, Lucide Icons.
*   **Backend**: Node.js, Express, Socket.io (Real-time features).
*   **Database**: PostgreSQL (via Neon/Supabase), Prisma ORM.
*   **Payments**: Stripe Connect.
*   **Storage**: Local/Cloudinary (for images).
