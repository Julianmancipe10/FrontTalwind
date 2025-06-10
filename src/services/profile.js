import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const updateUserProfile = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('🔍 profile.js enviando a:', `${API_URL}/users/profile`);
    console.log('🔑 Token presente:', !!token);
    console.log('🔑 Token empieza con:', token ? token.substring(0, 20) + '...' : 'No token');
    console.log('📦 Datos enviados:', formData);
    
    const response = await axios.put(`${API_URL}/users/profile`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.log('❌ Error response:', error.response.status, error.response.data);
      
      // Si el token expiró, limpiar localStorage y redirigir al login
      if (error.response.status === 403 || error.response.status === 401) {
        console.log('🔑 Token expirado, limpiando localStorage...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/LoginPage';
        return;
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

    console.log('🔍 profile.js JSON enviando a:', `${API_URL}/users/profile`);
    console.log('🔑 Token presente:', !!token);
    console.log('📦 Datos JSON enviados:', userData);
    
    const response = await axios.put(`${API_URL}/users/profile`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.log('❌ Error response:', error.response.status, error.response.data);
      
      // Si el token expiró, limpiar localStorage y redirigir al login
      if (error.response.status === 403 || error.response.status === 401) {
        console.log('🔑 Token expirado, limpiando localStorage...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/LoginPage';
        return;
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