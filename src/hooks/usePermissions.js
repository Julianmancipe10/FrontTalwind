import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { PERMISOS } from '../constants/roles';
import { getCurrentUser } from '../services/auth';

const API_URL = 'http://localhost:3000/api'; // Corregido: usar el mismo puerto que en auth.js

export const usePermissions = () => {
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const user = getCurrentUser();
      
      if (!token || !user) {
        setUserPermissions([]);
        setLoading(false);
        return;
      }

      // Si el usuario está disponible en localStorage, usar sus permisos directamente
      if (user.permisos && Array.isArray(user.permisos)) {
        setUserPermissions(user.permisos);
        setLoading(false);
        return;
      }

      // Si no hay permisos en localStorage, intentar obtenerlos del backend
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.permisos) {
          setUserPermissions(response.data.permisos);
          // Actualizar localStorage con los permisos
          const updatedUser = { ...user, permisos: response.data.permisos };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } else {
          setUserPermissions([]);
        }
      } catch (error) {
        console.error('Error loading permissions from server:', error);
        // Si falla la petición al servidor, usar permisos por defecto según el rol
        const defaultPermissions = getDefaultPermissionsByRole(user.rol);
        setUserPermissions(defaultPermissions);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
      setError(error.message || 'Error al cargar permisos');
      setUserPermissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función helper para obtener permisos por defecto según el rol
  const getDefaultPermissionsByRole = (rol) => {
    const { ROLES_PERMISOS } = require('../constants/roles');
    return ROLES_PERMISOS[rol] || [];
  };

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  const hasPermission = useCallback((permiso) => {
    return userPermissions.includes(permiso);
  }, [userPermissions]);

  const hasAnyPermission = useCallback((permissions) => {
    if (loading) return false;
    return permissions.some(permission => userPermissions.includes(permission));
  }, [loading, userPermissions]);

  const hasAllPermissions = useCallback((permissions) => {
    if (loading) return false;
    return permissions.every(permission => userPermissions.includes(permission));
  }, [loading, userPermissions]);

  return {
    permissions: userPermissions,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refreshPermissions: loadPermissions
  };
}; 