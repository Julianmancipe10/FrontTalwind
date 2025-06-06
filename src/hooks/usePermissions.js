import { useEffect, useState } from 'react';
import { PERMISOS } from '../constants/roles';

export const usePermissions = () => {
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const userString = localStorage.getItem('user');
        if (!userString) {
          setUserPermissions([]);
          return;
        }
        
        const user = JSON.parse(userString);
        if (user && user.permisos) {
          setUserPermissions(user.permisos);
        } else {
          setUserPermissions([]);
        }
      } catch (error) {
        console.error('Error al cargar permisos:', error);
        setUserPermissions([]);
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