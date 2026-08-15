import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute ensures only logged-in users can access the page
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;


