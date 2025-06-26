import { buildApiUrl, getAuthHeaders, isAuthenticated } from './config.js';

// Obtener todos los instructores
export const getInstructores = async () => {
  try {
    const response = await fetch(buildApiUrl('/instructores'));
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const instructores = await response.json();
    console.log('📚 Instructores cargados:', instructores);
    return instructores;
  } catch (error) {
    console.error('❌ Error al obtener instructores:', error);
    throw error;
  }
};

// Obtener instructores y funcionarios (alias para compatibilidad)
export const getInstructoresYFuncionarios = async () => {
  try {
    const response = await fetch(buildApiUrl('/instructores'));
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📚 Instructores y funcionarios cargados:', data);
    return data.data || data || [];
  } catch (error) {
    console.error('❌ Error al obtener instructores y funcionarios:', error);
    throw error;
  }
};

// Crear instructor (requiere autenticación)
export const createInstructor = async (instructorData) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    console.log('👨‍🏫 Creando instructor...', instructorData);

    const response = await fetch(buildApiUrl('/instructores'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(instructorData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
      }
      if (response.status === 403) {
        throw new Error('No tienes permisos para crear instructores.');
      }
      
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Instructor creado exitosamente:', result);
    return result;
  } catch (error) {
    console.error('❌ Error al crear instructor:', error);
    throw error;
  }
};

// Actualizar instructor (requiere autenticación)
export const updateInstructor = async (id, instructorData) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    const response = await fetch(buildApiUrl(`/instructores/${id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(instructorData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
      }
      if (response.status === 403) {
        throw new Error('No tienes permisos para editar instructores.');
      }
      
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar instructor:', error);
    throw error;
  }
};

// Eliminar instructor (requiere autenticación)
export const deleteInstructor = async (id) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    const response = await fetch(buildApiUrl(`/instructores/${id}`), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
      }
      if (response.status === 403) {
        throw new Error('No tienes permisos para eliminar instructores.');
      }
      
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al eliminar instructor:', error);
    throw error;
  }
};

// Obtener instructor por ID
export const getInstructorById = async (id) => {
  try {
    const response = await fetch(buildApiUrl(`/instructores/${id}`));
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al obtener instructor:', error);
    throw error;
  }
};

// Obtener perfil del instructor autenticado
export const getMiPerfil = async () => {
  try {
    if (!isAuthenticated()) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    const response = await fetch(buildApiUrl('/instructores/mi/perfil'), {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
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
    if (!isAuthenticated()) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    const response = await fetch(buildApiUrl('/instructores/mi/perfil'), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
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
    const response = await fetch(buildApiUrl(`/instructores/${instructorId}/calificaciones`));
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
    if (!isAuthenticated()) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    const response = await fetch(buildApiUrl('/instructores/mi/calificaciones'), {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
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