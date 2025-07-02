import { buildApiUrl } from './config';

// Helper para obtener headers de autorización
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No hay token de autenticación');
    return {};
  }
  return {
    'Authorization': `Bearer ${token}`
  };
};

// Helper para manejar respuestas de error
const handleErrorResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Si no se puede parsear el JSON, usar el mensaje por defecto
    }
    
    if (response.status === 401) {
      errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
      // Limpiar token inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } else if (response.status === 403) {
      errorMessage = 'No tienes permisos para realizar esta acción.';
    }
    
    throw new Error(errorMessage);
  }
};

// Obtener eventos
export const getEventos = async () => {
  try {
    const response = await fetch(buildApiUrl('/publicaciones/eventos'));
    await handleErrorResponse(response);
    return await response.json();
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    throw error;
  }
};

// Obtener noticias
export const getNoticias = async () => {
  try {
    const response = await fetch(buildApiUrl('/publicaciones/noticias'));
    await handleErrorResponse(response);
    return await response.json();
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    throw error;
  }
};

// Obtener carreras
export const getCarreras = async () => {
  try {
    const response = await fetch(buildApiUrl('/publicaciones/carreras'));
    await handleErrorResponse(response);
    return await response.json();
  } catch (error) {
    console.error('Error al obtener carreras:', error);
    throw error;
  }
};

// Obtener publicación por ID
export const getPublicacionById = async (id) => {
  try {
    const response = await fetch(buildApiUrl(`/publicaciones/${id}`));
    await handleErrorResponse(response);
    return await response.json();
  } catch (error) {
    console.error('Error al obtener publicación:', error);
    throw error;
  }
};

// Crear evento
export const createEvento = async (eventoData, imagen) => {
  try {
    console.log('🚀 Creando evento...', { eventoData, hasImage: !!imagen });
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    const formData = new FormData();
    formData.append('titulo', eventoData.titulo);
    formData.append('fecha', eventoData.fecha);
    formData.append('descripcion', eventoData.descripcion);
    if (eventoData.enlace) {
      formData.append('enlace', eventoData.enlace);
    }
    if (imagen) {
      formData.append('imagen', imagen);
    }

    console.log('📤 Enviando evento al backend...', buildApiUrl('/publicaciones/eventos'));

    const response = await fetch(buildApiUrl('/publicaciones/eventos'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });

    await handleErrorResponse(response);
    const result = await response.json();
    
    console.log('✅ Evento creado exitosamente:', result);
    return result;
  } catch (error) {
    console.error('❌ Error al crear evento:', error);
    throw error;
  }
};

// Crear noticia
export const createNoticia = async (noticiaData, imagenes) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    const formData = new FormData();
    formData.append('titulo', noticiaData.titulo);
    formData.append('fecha', noticiaData.fecha);
    formData.append('descripcion', noticiaData.descripcion);
    if (noticiaData.enlace) {
      formData.append('enlace', noticiaData.enlace);
    }
    
    if (imagenes && imagenes.length > 0) {
      imagenes.forEach(imagen => {
        formData.append('imagenes', imagen);
      });
    }

    const response = await fetch(buildApiUrl('/publicaciones/noticias'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });

    await handleErrorResponse(response);
    return await response.json();
  } catch (error) {
    console.error('Error al crear noticia:', error);
    throw error;
  }
};

// Crear carrera
export const createCarrera = async (carreraData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    const response = await fetch(buildApiUrl('/publicaciones/carreras'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(carreraData)
    });

    await handleErrorResponse(response);
    return await response.json();
  } catch (error) {
    console.error('Error al crear carrera:', error);
    throw error;
  }
};

// Actualizar publicación
export const updatePublicacion = async (id, updateData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    // Determinar si es FormData o JSON
    const isFormData = updateData instanceof FormData;
    
    const headers = {
      ...getAuthHeaders()
    };

    // Si no es FormData, agregar Content-Type para JSON
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const body = isFormData ? updateData : JSON.stringify(updateData);

    const response = await fetch(buildApiUrl(`/publicaciones/${id}`), {
      method: 'PUT',
      headers,
      body
    });

    await handleErrorResponse(response);
    return await response.json();
  } catch (error) {
    console.error('Error al actualizar publicación:', error);
    throw error;
  }
};

// Eliminar publicación
export const deletePublicacion = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }

    const response = await fetch(buildApiUrl(`/publicaciones/${id}`), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    await handleErrorResponse(response);
    return await response.json();
  } catch (error) {
    console.error('Error al eliminar publicación:', error);
    throw error;
  }
}; 