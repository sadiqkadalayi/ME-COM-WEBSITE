import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactUsPage from './pages/ContactUsPage';
import ForgotPassword from './pages/ForgotPassword';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProtectedRoute from './utils/ProtectedRoute';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/category/:categorySlug" element={<CategoryPage />} />
    <Route path="/product/:productId" element={<ProductDetailsPage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/contact-us" element={<ContactUsPage />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    } />
  </Routes>
);

export default AppRouter;
