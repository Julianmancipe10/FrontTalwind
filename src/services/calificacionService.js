const API_BASE = 'http://localhost:5000/api/instructores/calificaciones';

// Crear una nueva calificación
export const crearCalificacion = async (calificacionData) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Agregar token si está disponible
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(calificacionData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear calificación');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en crearCalificacion:', error);
    throw error;
  }
};

// Verificar estudiante por documento
export const verificarEstudiante = async (documento) => {
  try {
    const response = await fetch(`${API_BASE}/verificar-estudiante`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ documento })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al verificar estudiante');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error en verificarEstudiante:', error);
    throw error;
  }
};

// Obtener calificaciones de un instructor específico
export const getCalificacionesPorInstructor = async (instructorId) => {
  try {
    const response = await fetch(`${API_BASE}/instructor/${instructorId}`);
    if (!response.ok) {
      throw new Error('Error al obtener calificaciones');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error en getCalificacionesPorInstructor:', error);
    throw error;
  }
};

// Obtener estadísticas de calificaciones de un instructor
export const getEstadisticasInstructor = async (instructorId) => {
  try {
    const response = await fetch(`${API_BASE}/instructor/${instructorId}/estadisticas`);
    if (!response.ok) {
      throw new Error('Error al obtener estadísticas');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error en getEstadisticasInstructor:', error);
    throw error;
  }
};

// Verificar si el usuario autenticado puede calificar a un instructor
export const verificarPuedeCalificar = async (instructorId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { puedeCalificar: false, razon: 'Usuario no autenticado' };
    }
    
    const response = await fetch(`${API_BASE}/puede-calificar/${instructorId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return { puedeCalificar: false, razon: errorData.message };
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error en verificarPuedeCalificar:', error);
    return { puedeCalificar: false, razon: 'Error del servidor' };
  }
};

// Reportar una calificación
export const reportarCalificacion = async (calificacionId, motivo) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Debe estar autenticado para reportar una calificación');
    }
    
    const response = await fetch(`${API_BASE}/${calificacionId}/reportar`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ motivo })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al reportar calificación');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en reportarCalificacion:', error);
    throw error;
  }
}; 