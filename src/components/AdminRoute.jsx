import React from 'react';
import { Navigate } from 'react-router-dom';

// AdminRoute restricts access to admin users only
const AdminRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/notes" replace />;
  }

  return children;
};

export default AdminRoute;


