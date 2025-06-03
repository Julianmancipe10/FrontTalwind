import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';

export const ProtectedRoute = ({ 
  children, 
  requiredPermissions = [], 
  requireAll = false 
}) => {
  const { loading, hasPermission, hasAllPermissions } = usePermissions();

  if (loading) {
    return <div>Cargando...</div>;
  }

  const hasAccess = requireAll 
    ? hasAllPermissions(requiredPermissions)
    : requiredPermissions.some(permission => hasPermission(permission));

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
}; 