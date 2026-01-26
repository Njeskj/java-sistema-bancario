import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  isAuthenticated: boolean;
}

export default function PrivateRoute({ isAuthenticated }: PrivateRouteProps) {
  // Verificar token diretamente no localStorage (mais confiável)
  const token = localStorage.getItem('token');
  const hasToken = !!token;
  
  return hasToken ? <Outlet /> : <Navigate to="/login" replace />;
}
