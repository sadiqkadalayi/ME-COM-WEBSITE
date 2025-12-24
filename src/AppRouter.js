import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactUsPage from './pages/ContactUsPage';
import ForgotPassword from './pages/ForgotPassword';

// Temporary Dashboard component until a proper one is created
const DashboardPage = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Dashboard</h1>
    <p>Welcome to your dashboard! This is a temporary placeholder.</p>
  </div>
);

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/contact-us" element={<ContactUsPage />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/dashboard" element={<DashboardPage />} />
  </Routes>
);

export default AppRouter;
