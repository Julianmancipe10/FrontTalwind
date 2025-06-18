import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

const PermissionWrapper = ({ 
  children, 
  requiredPermissions = [], 
  requireAll = false, 
  fallbackComponent = null 
}) => {
  const { hasPermission } = usePermissions();

  // Si no se proporcionan permisos, mostrar el contenido
  if (requiredPermissions.length === 0) {
    return children;
  }

  // Verificar permisos
  const hasAccess = requireAll 
    ? requiredPermissions.every(permission => hasPermission(permission))
    : requiredPermissions.some(permission => hasPermission(permission));

  // Si no tiene acceso, mostrar fallback o nada
  if (!hasAccess) {
    return fallbackComponent || null;
  }

  return children;
};

export default PermissionWrapper; 