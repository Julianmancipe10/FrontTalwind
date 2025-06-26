import { buildApiUrl, getAuthHeaders } from './config.js';

// Helper para requests con timeout y retry
const fetchWithTimeout = async (url, options = {}, timeout = 15000, retries = 2) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError' && retries > 0) {
            console.log(`⏰ Timeout, reintentando... ${retries} intentos restantes`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1s
            return fetchWithTimeout(url, options, timeout, retries - 1);
        }
        
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        console.log('🔐 Intentando login...', { email: credentials.correo });
        
        const response = await fetchWithTimeout(buildApiUrl('/auth/login'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // Manejo específico de errores de autenticación
            if (response.status === 401) {
                throw new Error('Credenciales incorrectas. Verifica tu correo y contraseña.');
            }
            if (response.status === 429) {
                throw new Error('Demasiados intentos de inicio de sesión. Espera 15 minutos.');
            }
            if (response.status >= 500) {
                throw new Error('Error del servidor. Por favor, intenta más tarde.');
            }
            throw new Error(data.message || 'Error al iniciar sesión');
        }

        // Guardar el token en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        console.log('✅ Login exitoso:', { user: data.user.nombre, rol: data.user.rol });
        return data;
    } catch (error) {
        console.error('❌ Error al iniciar sesión:', error);
        
        // Manejo de errores de red
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Error de conexión. Verifica tu conexión a internet.');
        }
        
        if (error.name === 'AbortError') {
            throw new Error('La solicitud tardó demasiado. Verifica tu conexión e intenta nuevamente.');
        }
        
        throw new Error(error.message || 'Error al iniciar sesión');
    }
};

export const registerUser = async (userData) => {
    try {
        // Validar datos antes de enviar
        if (!userData.nombre || !userData.apellido || !userData.correo || !userData.documento || !userData.password || !userData.rol) {
            throw new Error('Todos los campos son requeridos');
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.correo)) {
            throw new Error('Formato de email inválido');
        }

        // Validar longitud de contraseña
        if (userData.password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        // Validar formato de documento (solo números)
        const documentoRegex = /^\d+$/;
        if (!documentoRegex.test(userData.documento)) {
            throw new Error('El documento debe contener solo números');
        }

        // Validar rol
        const rolesValidos = ['aprendiz', 'instructor', 'funcionario'];
        if (!rolesValidos.includes(userData.rol)) {
            throw new Error('Rol no válido');
        }

        const response = await fetchWithTimeout(buildApiUrl('/auth/register'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al registrar usuario');
        }

        // Solo guardar token si no requiere validación (aprendices)
        if (!data.requiresValidation && data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw new Error(error.message || 'Error al registrar usuario');
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('👋 Usuario desconectado');
};

export const getCurrentUser = () => {
    try {
        const user = localStorage.getItem('user');
        if (!user || user === 'undefined' || user === 'null') {
            return null;
        }
        return JSON.parse(user);
    } catch (error) {
        console.error('Error al obtener usuario actual:', error);
        // Limpiar localStorage si hay datos corruptos
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
    }
};

export const getAuthHeader = () => {
    return getAuthHeaders();
};

// Funciones para gestión administrativa
export const getPendingValidations = async () => {
    try {
        const response = await fetchWithTimeout(buildApiUrl('/auth/admin/pending-validations'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener solicitudes pendientes');
        }

        return data;
    } catch (error) {
        console.error('Error al obtener solicitudes pendientes:', error);
        throw new Error(error.message || 'Error al obtener solicitudes pendientes');
    }
};

export const approveValidation = async (solicitudId, observaciones = '') => {
    try {
        const response = await fetchWithTimeout(buildApiUrl(`/auth/admin/approve-validation/${solicitudId}`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify({ observaciones }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al aprobar solicitud');
        }

        return data;
    } catch (error) {
        console.error('Error al aprobar solicitud:', error);
        throw new Error(error.message || 'Error al aprobar solicitud');
    }
};

export const rejectValidation = async (solicitudId, observaciones) => {
    try {
        if (!observaciones || observaciones.trim() === '') {
            throw new Error('Las observaciones son requeridas para rechazar una solicitud');
        }

        const response = await fetchWithTimeout(buildApiUrl(`/auth/admin/reject-validation/${solicitudId}`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify({ observaciones }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al rechazar solicitud');
        }

        return data;
    } catch (error) {
        console.error('Error al rechazar solicitud:', error);
        throw new Error(error.message || 'Error al rechazar solicitud');
    }
};