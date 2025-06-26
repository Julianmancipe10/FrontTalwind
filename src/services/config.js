// Configuración centralizada de la aplicación
const getBaseUrl = () => {
  // Detectar entorno basándose en la URL actual y variables de entorno
  const isDev = import.meta.env.DEV;
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isDev || isLocal) {
    // En desarrollo local, usar proxy de Vite que redirige a localhost:5000
    return '/api';
  }
  
  // En producción, usar URL completa
  return 'https://senaunitybackend-production.up.railway.app/api';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 15000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      ME: '/auth/me'
    },
    USERS: '/usuarios',
    EVENTS: '/eventos',
    SCHEDULES: '/horarios',
    ADMIN: '/admin',
    PUBLICACIONES: '/publicaciones',
    INSTRUCTORES: '/instructores',
    FAQ: '/faq'
  }
};

// Helper para construir URLs completas
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper para headers de autenticación
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Helper para obtener información del usuario
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
};

console.log('🔧 API Config:', {
  baseUrl: API_CONFIG.BASE_URL,
  isDev: import.meta.env.DEV,
  isAuthenticated: isAuthenticated()
});

export default API_CONFIG; 