const API_URL = 'http://localhost:5000/api';

export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al iniciar sesión');
        }

        // Guardar el token en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
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

        const response = await fetch(`${API_URL}/auth/register`, {
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
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Nuevas funciones para gestión administrativa
export const getPendingValidations = async () => {
    try {
        const response = await fetch(`${API_URL}/auth/admin/pending-validations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
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
        const response = await fetch(`${API_URL}/auth/admin/approve-validation/${solicitudId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
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

        const response = await fetch(`${API_URL}/auth/admin/reject-validation/${solicitudId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
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