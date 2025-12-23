import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, requiredRole, children }) => {
  // Check 1: Is there a user logged in?
  if (!user) {
    // If not, redirect to the home page
    return <Navigate to="/" replace />;
  }

  // Check 2: Does the user have the required role?
  if (requiredRole && user.role !== requiredRole) {
    // If they don't have the right role, redirect to home page
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the component
  return children;
};

export default ProtectedRoute;