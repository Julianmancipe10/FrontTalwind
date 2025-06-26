import axios from "axios";

const API_URL = 'https://senaunitybackend-production.up.railway.app/api';

// Cache simple para respuestas frecuentes
const responseCache = new Map();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

const getCacheKey = (question) => {
  return question.toLowerCase().trim();
};

const checkCache = (question) => {
  const key = getCacheKey(question);
  const cached = responseCache.get(key);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.answer;
  }
  return null;
};

const addToCache = (question, answer) => {
  const key = getCacheKey(question);
  responseCache.set(key, {
    answer,
    timestamp: Date.now()
  });
};

export const preguntarFAQ = async (question, context = "") => {
  try {
    // Verificar caché primero
    const cachedAnswer = checkCache(question);
    if (cachedAnswer) {
      return cachedAnswer;
    }

    const res = await axios.post(API_URL, { 
      question,
      context,
      timestamp: new Date().toISOString()
    });

    // Guardar en caché
    addToCache(question, res.data.answer);
    
    return res.data.answer;
  } catch (error) {
    console.error("Error en preguntarFAQ:", error);

    if (error.response) {
      // Error con respuesta del servidor
      const message = error.response.data.error || 
                     error.response.data.message || 
                     "Error en el servidor";
      throw new Error(message);
    } else if (error.request) {
      // Error de red
      throw new Error("No se pudo conectar con el servidor. Por favor, verifica tu conexión.");
    } else {
      // Error de configuración
      throw new Error("Error al procesar la solicitud. Por favor, intenta de nuevo.");
    }
  }
};

export const sendMessage = async (message) => {
  try {
    if (!message || message.trim() === '') {
      throw new Error('El mensaje no puede estar vacío');
    }

    const response = await fetch(`${API_URL}/faq/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message.trim() }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Demasiadas solicitudes. Por favor, espera un momento antes de intentar nuevamente.');
      }
      
      if (response.status === 503) {
        throw new Error('Servicio de IA temporalmente no disponible. Por favor, intenta más tarde.');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.response) {
      throw new Error('Respuesta inválida del servidor');
    }

    return data;
  } catch (error) {
    console.error('Error al enviar mensaje al FAQ:', error);
    
    // Manejo específico de errores de red
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
    
    throw error;
  }
};

export const getFAQHistory = async () => {
  try {
    const response = await fetch(`${API_URL}/faq/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return []; // No hay historial disponible
      }
      throw new Error(`Error al obtener historial: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener historial FAQ:', error);
    return []; // Retornar array vacío en caso de error
  }
};
