import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import Profile from './pages/Profile';
import LoadingSpinner from './components/LoadingSpinner';

// Helper component for default root redirect
const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  return isAuthenticated ? <Navigate to="/products" replace /> : <Navigate to="/register" replace />;
};

// Helper component for public auth routes (prevents logged in users from viewing register/login)
const PublicAuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  return isAuthenticated ? <Navigate to="/products" replace /> : children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Default Root Redirect: Unauthenticated users go to /register first */}
              <Route path="/" element={<RootRedirect />} />

              {/* Public Auth Routes */}
              <Route
                path="/register"
                element={
                  <PublicAuthRoute>
                    <Register />
                  </PublicAuthRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicAuthRoute>
                    <Login />
                  </PublicAuthRoute>
                }
              />

              {/* Protected App Routes - Require Register & Login First */}
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/new"
                element={
                  <ProtectedRoute>
                    <CreateProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Fallback Route */}
              <Route path="*" element={<RootRedirect />} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} E-Commerce Product Management Platform. Production-grade clean architecture.
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
