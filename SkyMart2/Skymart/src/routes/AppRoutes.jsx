import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import Loader from '../components/UI/Loader';

// Lazy loading pages for optimal performance
const HomePage = lazy(() => import('../pages/Home/HomePage'));
const CategoryPage = lazy(() => import('../pages/Category/CategoryPage'));
const ProductDetailPage = lazy(() => import('../pages/Product/ProductDetailPage'));
const CheckoutPage = lazy(() => import('../pages/Checkout/CheckoutPage'));
const LoginPage = lazy(() => import('../pages/Login/LoginPage'));
const RegisterPage = lazy(() => import('../pages/Register/RegisterPage'));
const ProfilePage = lazy(() => import('../pages/Profile/ProfilePage'));
const OrderHistoryPage = lazy(() => import('../pages/Orders/OrderHistoryPage'));
const OrderDetailsPage = lazy(() => import('../pages/Orders/OrderDetailsPage'));
const WishlistPage = lazy(() => import('../pages/Wishlist/WishlistPage'));
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard'));
const ManageProducts = lazy(() => import('../pages/Admin/ManageProducts'));
const ManageCategories = lazy(() => import('../pages/Admin/ManageCategories'));
const ManageOrders = lazy(() => import('../pages/Admin/ManageOrders'));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader fullPage text="Preparing fresh groceries..." />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          
          {/* Public Auth Routes */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* User Protected Routes */}
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/products"
            element={
              <ProtectedRoute requireAdmin>
                <ManageProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/categories"
            element={
              <ProtectedRoute requireAdmin>
                <ManageCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/orders"
            element={
              <ProtectedRoute requireAdmin>
                <ManageOrders />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
