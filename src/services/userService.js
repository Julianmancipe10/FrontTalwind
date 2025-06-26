import axios from 'axios';
import { buildApiUrl } from './config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const userService = {
  // Obtener todos los usuarios
  getAllUsers: async () => {
    try {
      const response = await axios.get(buildApiUrl('/users'), {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
    }
  },

  // Crear usuario (solo administradores)
  createUser: async (userData) => {
    try {
      // Validaciones del lado del cliente
      if (!userData.nombre || !userData.apellido || !userData.correo || !userData.documento || !userData.password || !userData.rol) {
        throw new Error('Todos los campos son requeridos');
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.correo)) {
        throw new Error('Formato de email inválido');
      }

      // Validar longitud de contraseña
      if (userData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Validar formato de documento (solo números)
      const documentoRegex = /^\d+$/;
      if (!documentoRegex.test(userData.documento)) {
        throw new Error('El documento debe contener solo números');
      }

      // Validar rol
      const rolesValidos = ['instructor', 'funcionario'];
      if (!rolesValidos.includes(userData.rol.toLowerCase())) {
        throw new Error('Solo se pueden crear usuarios con rol instructor o funcionario');
      }

      const response = await axios.post(buildApiUrl('/users'), userData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Error al crear usuario');
    }
  },

  // Eliminar usuario
  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(buildApiUrl(`/users/${userId}`), {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar usuario');
    }
  },

  // Obtener usuario por ID
  getUserById: async (userId) => {
    try {
      const response = await axios.get(buildApiUrl(`/users/${userId}`), {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuario');
    }
  },

  // Actualizar usuario
  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(buildApiUrl(`/users/${userId}`), userData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
    }
  }
};

export default userService; 