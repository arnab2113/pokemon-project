# Production-Quality Full-Stack E-Commerce Product Management System

A secure, scalable, full-stack E-Commerce Product Management application engineered with **Node.js, Express.js, MongoDB (Mongoose), express-validator, JWT (Access + Refresh Token architecture), and React (Vite)**.

Built strictly following clean architecture, security best practices, and enterprise coding guidelines.

---

## Key Features

### Backend
- **Dual-Token Authentication System**:
  - **Access Token**: Short-lived (15 mins), stored strictly in-memory on the client to prevent XSS.
  - **Refresh Token**: Long-lived (7 days), delivered via `httpOnly`, `Secure` (production), `SameSite=lax` cookie.
  - **Server-Side Token Revocation**: Refresh tokens are SHA-256 hashed before persistence in MongoDB for instant revocation upon logout or token refresh.
- **Express-Validator Integration**: Mandatory validation on all request bodies, route params, and search queries before controller execution. Standardized `400 Bad Request` with field-level errors.
- **Resource Ownership & Access Control**: Only the original creator of a product can update or delete it (`403 Forbidden` for unauthorized users).
- **Pagination & Text Search**: Built-in regex search and paginated queries (`?page=1&limit=10`).
- **Security Hardening**: Helmet security headers, CORS restricted to `CLIENT_URL` with credentials, bcrypt password hashing (10 salt rounds), rate limiting on authentication routes.
- **Automated Testing Suite**: Built-in test suite powered by Vitest, Supertest, and `mongodb-memory-server`.

### Frontend
- **Modern Responsive UI**: Built with React, Vite, React Router v6, and Tailwind CSS.
- **Silent Refresh Interceptor**: Custom Axios interceptor transparently refreshes expired access tokens in the background without disturbing the user session. Handles concurrent request queuing.
- **Auth State Management**: Clean `AuthContext` restoring session state automatically on app boot via refresh cookie.
- **Product Management UI**: Responsive product grid, search bar, category filters, pagination controls, owner-only Edit/Delete triggers, confirmation modals, loading spinners, and error banners.

---

## Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Backend Framework** | Node.js, Express.js |
| **Database & ODM** | MongoDB, Mongoose |
| **Security & Auth** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cookie-parser`, `helmet`, `cors`, `express-rate-limit` |
| **Validation** | `express-validator` |
| **Testing** | Vitest, Supertest, `mongodb-memory-server` |
| **Frontend Framework** | React 18, Vite, React Router v6 |
| **Styling & UI** | Tailwind CSS, Lucide Icons |
| **HTTP Client** | Axios (with Request/Response Interceptors) |

---

## Repository Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection & env validation
│   │   ├── controllers/     # Auth & Product route handlers
│   │   ├── middleware/      # Auth, express-validator handler, 404, error handler
│   │   ├── models/          # User, Product, RefreshToken Mongoose schemas
│   │   ├── routes/          # Auth & Product API route definitions
│   │   ├── validators/      # Field-level express-validator schemas
│   │   ├── utils/           # JWT helpers, token hashing, cookies, response formatters
│   │   ├── tests/           # Integration tests (Vitest + Supertest)
│   │   ├── app.js           # Express app setup & middleware stack
│   │   └── server.js        # Server listener & graceful shutdown
│   ├── .env.example
│   ├── package.json
│   └── vitest.config.js
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, ProductCard, ProductForm, ProtectedRoute, etc.
│   │   ├── pages/           # Login, Register, Products, CreateProduct, EditProduct, Profile
│   │   ├── services/        # Axios API client, auth & product API wrappers
│   │   ├── context/         # AuthContext provider & hooks
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
│
├── docs/
│   └── API.md              # Detailed API specification
├── .gitignore
└── README.md
```

---

## Authentication Architecture

```
Client (React)                  Express API                     MongoDB
      │                              │                             │
      ├─── POST /api/auth/login ────>│                             │
      │    { email, password }       │── Compare bcrypt hash ─────>│
      │                              │<── User Record ─────────────│
      │                              │                             │
      │<── 200 OK ───────────────────│── Save SHA-256 token hash ──>│
      │    Body: { accessToken }     │                             │
      │    Cookie: refreshToken      │                             │
      │    (httpOnly, secure)        │                             │
      │                              │                             │
      ├─── GET /api/products/new ───>│                             │
      │    Header: Bearer <access>   │── Verify JWT Access Token ──│
      │                              │                             │
```

1. **Registration**: Validates name, email, password strength, and matching `confirmPassword`. Checks duplicate email (`409 Conflict`). Hashes password with bcrypt (10 rounds). Does **not** issue tokens upon registration.
2. **Login**: Verifies credentials using bcrypt. Generates short-lived Access Token (15m) returned in JSON body, and long-lived Refresh Token (7d) set in an HTTP-Only cookie. SHA-256 hash of refresh token is saved to MongoDB.
3. **Silent Refresh**: When access token expires (HTTP 401), frontend Axios interceptor automatically posts to `/api/auth/refresh-token` with the HTTP-Only cookie, validates the hashed token in DB, rotates tokens, and retries original request.
4. **Logout**: Revokes the refresh token in MongoDB (`revokedAt = Date.now()`) and clears the HTTP-Only cookie.

---

## API Endpoints Reference

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Register new user account |
| **POST** | `/api/auth/login` | Public | Authenticate user & issue tokens |
| **POST** | `/api/auth/refresh-token` | Cookie | Obtain new access token via refresh token |
| **POST** | `/api/auth/logout` | Public/Cookie | Revoke refresh token & clear cookie |
| **GET** | `/api/auth/me` | Bearer Token | Fetch authenticated user profile |
| **GET** | `/api/products` | Public | Get paginated products list (`?page&limit&search&category`) |
| **GET** | `/api/products/:id` | Public | Get single product by ObjectId |
| **POST** | `/api/products` | Bearer Token | Create new product |
| **PUT** | `/api/products/:id` | Bearer Token | Update product (Owner only) |
| **DELETE** | `/api/products/:id` | Bearer Token | Delete product (Owner only) |

---

## Environment Variables

### Backend Configuration (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
ACCESS_TOKEN_SECRET=production_access_secret_key_antigravity_ecommerce_2026_jwt
REFRESH_TOKEN_SECRET=production_refresh_secret_key_antigravity_ecommerce_2026_jwt
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend Configuration (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Local Setup & Development

### Prerequisites
- **Node.js**: v18+ or v20+
- **MongoDB**: Local instance running on `mongodb://localhost:27017` (or MongoDB Atlas connection string)

### Step 1: Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment Files
Copy `.env.example` to `.env` in both `backend/` and `frontend/` directories:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Step 3: Run Backend Server
```bash
cd backend
npm run dev
```
Backend will start on `http://localhost:5000`.

### Step 4: Run Frontend Application
```bash
cd frontend
npm run dev
```
Frontend will start on `http://localhost:5173`.

---

## Running Automated Tests

Backend API integration tests run using **Vitest** and **`mongodb-memory-server`** (no running MongoDB daemon required):

```bash
cd backend
npm test
```

### Verified Test Cases:
- User registration & duplicate email handling (409).
- Validation errors formatting (400).
- User login with generic credentials check (401).
- Authenticated `/me` endpoint & token verification.
- Product CRUD operations, pagination, and ownership checks (403 Forbidden).

---

## Production Build & Deployment

### Production Build
```bash
# Build frontend static assets
cd frontend
npm run build
```
The compiled single-page app will be output to `frontend/dist`.

---

## Security Practices Checklist

- [x] Passwords hashed with `bcryptjs` (minimum 10 salt rounds).
- [x] Passwords excluded (`select: false`) in database queries.
- [x] Access Token stored in client memory (not localStorage).
- [x] Refresh Token delivered via `httpOnly`, `Secure` (production), `SameSite` cookies.
- [x] Refresh Tokens SHA-256 hashed on server to prevent stolen token reuse.
- [x] All endpoints validated using `express-validator` before controller invocation.
- [x] Helmet security headers applied.
- [x] CORS strict origin check matching `CLIENT_URL`.
- [x] Rate limiting applied to authentication endpoints.
- [x] Resource ownership enforced on mutation routes (PUT/DELETE).
