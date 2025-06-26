const API_BASE = 'https://senaunitybackend-production.up.railway.app/api/instructores';

// Obtener todos los instructores y funcionarios
export const getInstructoresYFuncionarios = async () => {
  try {
    const response = await fetch(`${API_BASE}`);
    if (!response.ok) {
      throw new Error('Error al obtener instructores y funcionarios');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error en getInstructoresYFuncionarios:', error);
    throw error;
  }
};

// Obtener un instructor específico por ID
export const getInstructorById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener instructor');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error en getInstructorById:', error);
    throw error;
  }
};

// Obtener perfil del instructor autenticado
export const getMiPerfil = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/mi/perfil`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener mi perfil');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error en getMiPerfil:', error);
    throw error;
  }
};

// Actualizar perfil del instructor autenticado
export const updateMiPerfil = async (perfilData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/mi/perfil`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(perfilData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar perfil');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error en updateMiPerfil:', error);
    throw error;
  }
};

// Obtener calificaciones de un instructor
export const getCalificacionesInstructor = async (instructorId) => {
  try {
    const response = await fetch(`${API_BASE}/${instructorId}/calificaciones`);
    if (!response.ok) {
      throw new Error('Error al obtener calificaciones');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error en getCalificacionesInstructor:', error);
    throw error;
  }
};

// Obtener mis calificaciones (instructor autenticado)
export const getMisCalificaciones = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/mi/calificaciones`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener mis calificaciones');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error en getMisCalificaciones:', error);
    throw error;
  }
}; 