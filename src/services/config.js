// Configuración centralizada de la aplicación
export const API_CONFIG = {
  BASE_URL: 'https://senaunitybackend-production.up.railway.app/api',
  TIMEOUT: 10000,
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
    ADMIN: '/admin'
  }
};

// Helper para construir URLs completas
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export default API_CONFIG; 