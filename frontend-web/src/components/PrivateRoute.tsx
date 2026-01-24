import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  isAuthenticated: boolean;
}

export default function PrivateRoute({ isAuthenticated }: PrivateRouteProps) {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
