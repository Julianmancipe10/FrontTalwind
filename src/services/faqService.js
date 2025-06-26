import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://senaunitybackend-production.up.railway.app/api/faq";

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
