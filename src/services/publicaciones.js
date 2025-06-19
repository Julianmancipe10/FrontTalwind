const API_URL = 'http://localhost:5000/api/publicaciones';

// Obtener eventos
export const getEventos = async () => {
  try {
    const response = await fetch(`${API_URL}/eventos`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const eventos = await response.json();
    return eventos;
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    throw error;
  }
};

// Obtener noticias
export const getNoticias = async () => {
  try {
    const response = await fetch(`${API_URL}/noticias`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const noticias = await response.json();
    return noticias;
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    throw error;
  }
};

// Obtener carreras
export const getCarreras = async () => {
  try {
    const response = await fetch(`${API_URL}/carreras`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const carreras = await response.json();
    return carreras;
  } catch (error) {
    console.error('Error al obtener carreras:', error);
    throw error;
  }
};

// Obtener publicación por ID
export const getPublicacionById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const publicacion = await response.json();
    return publicacion;
  } catch (error) {
    console.error('Error al obtener publicación:', error);
    throw error;
  }
};

// Crear evento
export const createEvento = async (eventoData, imagen) => {
  try {
    const formData = new FormData();
    formData.append('titulo', eventoData.titulo);
    formData.append('fecha', eventoData.fecha);
    formData.append('descripcion', eventoData.descripcion);
    formData.append('enlace', eventoData.enlace);
    formData.append('imagen', imagen);

    const response = await fetch(`${API_URL}/eventos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear evento');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear evento:', error);
    throw error;
  }
};

// Crear noticia
export const createNoticia = async (noticiaData, imagenes) => {
  try {
    const formData = new FormData();
    formData.append('titulo', noticiaData.titulo);
    formData.append('fecha', noticiaData.fecha);
    formData.append('descripcion', noticiaData.descripcion);
    formData.append('enlace', noticiaData.enlace);
    
    imagenes.forEach(imagen => {
      formData.append('imagenes', imagen);
    });

    const response = await fetch(`${API_URL}/noticias`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear noticia');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear noticia:', error);
    throw error;
  }
};

// Crear carrera
export const createCarrera = async (carreraData) => {
  try {
    const response = await fetch(`${API_URL}/carreras`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(carreraData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear carrera');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear carrera:', error);
    throw error;
  }
}; 