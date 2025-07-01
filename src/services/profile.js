import axios from 'axios';
import { API_BASE_URL, getAuthHeaders, getAuthHeadersFormData } from './config.js';

export const updateUserProfile = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('🔍 profile.js enviando a:', `${API_BASE_URL}/users/profile`);
    console.log('🔑 Token presente:', !!token);
    console.log('🔑 Token empieza con:', token ? token.substring(0, 20) + '...' : 'No token');
    console.log('📦 Datos enviados:', formData);
    
    const response = await axios.put(`${API_BASE_URL}/users/profile`, formData, {
      headers: getAuthHeadersFormData()
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.log('❌ Error response:', error.response.status, error.response.data);
      
      // Solo limpiar localStorage si es un error de autenticación definitivo
      if (error.response.status === 401) {
        console.log('🔑 Token no válido, limpiando localStorage...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/LoginPage';
        return;
      }
      
      // Para error 403, verificar si es por permisos o token expirado
      if (error.response.status === 403) {
        console.log('🔒 Error 403 - Verificando si es token expirado o problema de permisos');
        // Solo redirigir si el mensaje indica token expirado
        if (error.response.data.message && error.response.data.message.includes('Token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/LoginPage';
          return;
        }
      }
      
      // Para error 400, mostrar detalles específicos
      if (error.response.status === 400) {
        console.log('📋 Detalles del error 400:', error.response.data);
        console.log('📋 Errores específicos:', error.response.data.errors);
      }
      
      throw new Error(error.response.data.message || 'Error al actualizar el perfil');
    }
    console.log('❌ Error sin response:', error);
    throw error;
  }
};

export const updateUserProfileJSON = async (userData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('🔍 profile.js JSON enviando a:', `${API_BASE_URL}/users/profile`);
    console.log('🔑 Token presente:', !!token);
    console.log('📦 Datos JSON enviados:', userData);
    
    const response = await axios.put(`${API_BASE_URL}/users/profile`, userData, {
      headers: getAuthHeaders()
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.log('❌ Error response:', error.response.status, error.response.data);
      
      // Solo limpiar localStorage si es un error de autenticación definitivo
      if (error.response.status === 401) {
        console.log('🔑 Token no válido, limpiando localStorage...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/LoginPage';
        return;
      }
      
      // Para error 403, verificar si es por permisos o token expirado
      if (error.response.status === 403) {
        console.log('🔒 Error 403 - Verificando si es token expirado o problema de permisos');
        // Solo redirigir si el mensaje indica token expirado
        if (error.response.data.message && error.response.data.message.includes('Token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/LoginPage';
          return;
        }
      }
      
      // Para error 400, mostrar detalles específicos
      if (error.response.status === 400) {
        console.log('📋 Detalles del error 400:', error.response.data);
        console.log('📋 Errores específicos:', error.response.data.errors);
      }
      
      throw new Error(error.response.data.message || 'Error al actualizar el perfil');
    }
    console.log('❌ Error sin response:', error);
    throw error;
  }
}; 