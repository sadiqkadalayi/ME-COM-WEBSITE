import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, success } = useSelector((state) => state.login || {});
  const token = localStorage.getItem('token');
  
  // Check if user is authenticated (either from Redux state or localStorage)
  const isAuthenticated = (user && success) || token;
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;