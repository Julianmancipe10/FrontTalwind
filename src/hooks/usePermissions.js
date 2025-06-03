import { useEffect, useState } from 'react';
import { PERMISOS } from '../constants/roles';

export const usePermissions = () => {
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.permisos) {
          setUserPermissions(user.permisos);
        }
      } catch (error) {
        console.error('Error al cargar permisos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, []);

  const hasPermission = (permission) => {
    if (loading) return false;
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    if (loading) return false;
    return permissions.some(permission => userPermissions.includes(permission));
  };

  const hasAllPermissions = (permissions) => {
    if (loading) return false;
    return permissions.every(permission => userPermissions.includes(permission));
  };

  return {
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions: userPermissions
  };
}; 