# E-Commerce Product Management System - API Specification

## Overview

The backend API follows RESTful principles, uses JSON format for request and response payloads, and enforces input validation on all parameters, body fields, and query options using `express-validator`.

---

## Response Format

### Success Response Format
```json
{
  "success": true,
  "message": "Human readable summary",
  "data": { ... }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error summary description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

---

## HTTP Status Codes

| Status Code | Description | Usage |
| :--- | :--- | :--- |
| **200 OK** | Request succeeded | Successful GET, PUT, DELETE, Login, Refresh, Logout |
| **201 Created** | Resource created | Successful Registration, Product Creation |
| **400 Bad Request** | Validation or syntax failure | Invalid payload, malformed MongoDB ObjectId, express-validator error |
| **401 Unauthorized** | Authentication failure | Missing/expired access token, invalid credentials, revoked refresh token |
| **403 Forbidden** | Authorization failure | Attempting to update or delete a product owned by another user |
| **404 Not Found** | Resource missing | Route not found, product ID does not exist |
| **409 Conflict** | Resource collision | Attempting to register an existing email address |
| **500 Internal Error** | Unexpected server crash | Handled centrally without revealing internal stack trace in production |

---

## Authentication Endpoints (`/api/auth`)

### 1. Register User
- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Authentication**: Public
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "StrongPassword123!",
    "confirmPassword": "StrongPassword123!"
  }
  ```
- **Validation**:
  - `name`: 2-50 characters.
  - `email`: Valid email format, automatically normalized.
  - `password`: Minimum 8 characters.
  - `confirmPassword`: Must match `password`.
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "66f123456789abcdef123456",
        "name": "John Doe",
        "email": "john@example.com",
        "createdAt": "2026-09-23T00:00:00.000Z"
      }
    }
  }
  ```

---

### 2. Login User
- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Authentication**: Public
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "StrongPassword123!"
  }
  ```
- **Response (200 OK)**:
  - Sets HTTP-Only cookie `refreshToken` (Max-Age: 7 days, `httpOnly: true`, `sameSite: lax`).
  - Returns JSON payload:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "66f123456789abcdef123456",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR..."
    }
  }
  ```

---

### 3. Refresh Access Token
- **Method**: `POST`
- **URL**: `/api/auth/refresh-token`
- **Authentication**: HTTP-Only Cookie (`refreshToken`)
- **Response (200 OK)**:
  - Rotates refresh token in cookie.
  - Returns new JSON access token:
  ```json
  {
    "success": true,
    "message": "Access token refreshed successfully",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR..."
    }
  }
  ```

---

### 4. Logout User
- **Method**: `POST`
- **URL**: `/api/auth/logout`
- **Authentication**: Public / Cookie
- **Response (200 OK)**:
  - Revokes refresh token in database.
  - Clears `refreshToken` HTTP-Only cookie.

---

### 5. Get Current User Profile
- **Method**: `GET`
- **URL**: `/api/auth/me`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Current user fetched successfully",
    "data": {
      "user": {
        "id": "66f123456789abcdef123456",
        "name": "John Doe",
        "email": "john@example.com",
        "createdAt": "2026-09-23T00:00:00.000Z"
      }
    }
  }
  ```

---

## Product CRUD Endpoints (`/api/products`)

### 1. List Products
- **Method**: `GET`
- **URL**: `/api/products?page=1&limit=10&search=mouse&category=Electronics`
- **Authentication**: Public
- **Query Parameters**:
  - `page` (optional, positive integer, default: 1)
  - `limit` (optional, integer 1-100, default: 10)
  - `search` (optional, string for text search)
  - `category` (optional, category filter)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Products fetched successfully",
    "data": {
      "products": [
        {
          "id": "66f987654321fedcba654321",
          "name": "Wireless Gaming Mouse",
          "description": "Ergonomic high precision mouse",
          "price": 49.99,
          "stock": 15,
          "category": "Electronics",
          "image": "https://example.com/mouse.jpg",
          "createdBy": {
            "id": "66f123456789abcdef123456",
            "name": "John Doe",
            "email": "john@example.com"
          },
          "createdAt": "2026-09-23T00:00:00.000Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 1,
        "totalPages": 1,
        "hasNextPage": false,
        "hasPrevPage": false
      }
    }
  }
  ```

---

### 2. Get Single Product
- **Method**: `GET`
- **URL**: `/api/products/:id`
- **Authentication**: Public
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Product fetched successfully",
    "data": {
      "product": { ... }
    }
  }
  ```

---

### 3. Create Product
- **Method**: `POST`
- **URL**: `/api/products`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "name": "Wireless Gaming Mouse",
    "description": "Ergonomic high precision RGB gaming mouse",
    "price": 49.99,
    "stock": 15,
    "category": "Electronics",
    "image": "https://example.com/mouse.jpg"
  }
  ```
- **Response (201 Created)**: Returns created product with `createdBy` populated.

---

### 4. Update Product
- **Method**: `PUT`
- **URL**: `/api/products/:id`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Authorization Rule**: User must be the owner (`product.createdBy === req.user.userId`). Returns `403 Forbidden` if unauthorized.
- **Request Body**: Partial or full product fields.
- **Response (200 OK)**: Returns updated product.

---

### 5. Delete Product
- **Method**: `DELETE`
- **URL**: `/api/products/:id`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Authorization Rule**: User must be the owner. Returns `403 Forbidden` if unauthorized.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Product deleted successfully",
    "data": {
      "id": "66f987654321fedcba654321"
    }
  }
  ```
