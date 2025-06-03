import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const updateUserProfile = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await axios.put(`${API_URL}/auth/profile`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error al actualizar el perfil');
    }
    throw error;
  }
}; 