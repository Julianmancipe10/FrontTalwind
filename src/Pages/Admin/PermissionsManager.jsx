import React, { useState, useEffect } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISOS, PERMISOS_DESCRIPCION, ROLES } from '../../constants/roles';
import axios from 'axios';

const PermissionsManager = () => {
  const { hasPermission } = usePermissions();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [fechaLimite, setFechaLimite] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Permisos específicos que el administrador puede asignar
  const PERMISOS_ASIGNABLES = [
    { key: PERMISOS.CREAR_EVENTO, description: PERMISOS_DESCRIPCION[PERMISOS.CREAR_EVENTO], icon: '📅', category: 'Eventos y Contenido' },
    { key: PERMISOS.CREAR_NOTICIA, description: PERMISOS_DESCRIPCION[PERMISOS.CREAR_NOTICIA], icon: '📰', category: 'Eventos y Contenido' },
    { key: PERMISOS.CREAR_CARRERA, description: PERMISOS_DESCRIPCION[PERMISOS.CREAR_CARRERA], icon: '🎓', category: 'Académico' },
    { key: PERMISOS.CREAR_PUBLICACION, description: PERMISOS_DESCRIPCION[PERMISOS.CREAR_PUBLICACION], icon: '📝', category: 'Eventos y Contenido' },
    { key: PERMISOS.EDITAR_PUBLICACION, description: PERMISOS_DESCRIPCION[PERMISOS.EDITAR_PUBLICACION], icon: '✏️', category: 'Eventos y Contenido' },
    { key: PERMISOS.GESTIONAR_FORMACION, description: PERMISOS_DESCRIPCION[PERMISOS.GESTIONAR_FORMACION], icon: '📚', category: 'Académico' },
    { key: PERMISOS.GESTIONAR_ENLACES, description: PERMISOS_DESCRIPCION[PERMISOS.GESTIONAR_ENLACES], icon: '🔗', category: 'Gestión' }
  ];

  useEffect(() => {
    fetchUsers();
    // Establecer fecha límite por defecto a 1 año desde hoy
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    setFechaLimite(nextYear.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserPermissions(selectedUser);
      const userData = users.find(u => u.idUsuario.toString() === selectedUser);
      setSelectedUserData(userData);
    }
  }, [selectedUser, users]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Filtrar solo instructores y funcionarios
      const eligibleUsers = response.data.filter(user => 
        user.Rol === 'instructor' || user.Rol === 'funcionario'
      );
      setUsers(eligibleUsers);
    } catch (error) {
      setError('Error al cargar usuarios');
      console.error('Error:', error);
    }
  };

  const fetchUserPermissions = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/permissions/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        setUserPermissions(response.data.map(p => p.Nombre || p.permiso_nombre));
      } else {
        setUserPermissions([]);
      }
    } catch (error) {
      console.error('Error al cargar permisos del usuario:', error);
      setUserPermissions([]);
    }
  };

  const handlePermissionChange = (permissionKey) => {
    setUserPermissions(prev => {
      if (prev.includes(permissionKey)) {
        return prev.filter(p => p !== permissionKey);
      } else {
        return [...prev, permissionKey];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:5000/api/permissions/assign', {
        userId: selectedUser,
        permisos: userPermissions,
        fechaLimite
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      setSuccess(`Permisos actualizados exitosamente para ${selectedUserData?.Nombre} ${selectedUserData?.Apellido}`);
      
      // Limpiar formulario después de un tiempo
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error al actualizar permisos');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setSelectedUser(null);
    setSelectedUserData(null);
    setUserPermissions([]);
    setError('');
    setSuccess('');
  };

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.Rol?.toLowerCase() === filterRole;
    const matchesSearch = 
      user.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Correo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesRole && matchesSearch;
  });

  // Agrupar permisos por categoría
  const permissionsByCategory = PERMISOS_ASIGNABLES.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});

  if (!hasPermission(PERMISOS.ASIGNAR_PERMISOS)) {
    return (
      <div className="flex items-center justify-center py-8 px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 text-center max-w-md w-full">
          <div className="text-red-400 text-4xl sm:text-5xl mb-4">🔒</div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Acceso Denegado</h2>
          <p className="text-gray-300 text-sm sm:text-base">No tienes permiso para acceder a la gestión de permisos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            🔐 Gestión de Permisos
          </h1>
          <p className="text-sm sm:text-base lg:text-xl text-gray-300">
            Asigna permisos específicos a instructores y funcionarios
          </p>
        </div>

        {/* Alertas */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center">
              <span className="text-2xl mr-3">❌</span>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/50 text-green-300 px-6 py-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <p className="font-medium">{success}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Panel de Selección de Usuario */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
              <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">👥</span>
              Seleccionar Usuario
            </h2>

            {/* Filtros */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Buscar por nombre, apellido o correo:
                </label>
                <input
                  type="text"
                  placeholder="Escribe para buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Filtrar por rol:
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all" className="bg-gray-800">Todos los roles</option>
                  <option value="instructor" className="bg-gray-800">Instructor</option>
                  <option value="funcionario" className="bg-gray-800">Funcionario</option>
                </select>
              </div>
            </div>

            {/* Lista de usuarios */}
            <div className="space-y-3 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">🔍</span>
                  <p className="text-gray-400">No se encontraron usuarios</p>
                </div>
              ) : (
                filteredUsers.map(user => (
                  <div
                    key={user.idUsuario}
                    onClick={() => setSelectedUser(user.idUsuario.toString())}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedUser === user.idUsuario.toString()
                        ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user.Nombre?.charAt(0)}{user.Apellido?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">
                          {user.Nombre} {user.Apellido}
                        </h3>
                        <p className="text-gray-400 text-sm">{user.Correo}</p>
                        <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${
                          user.Rol === 'instructor' 
                            ? 'bg-blue-500/20 text-blue-300' 
                            : 'bg-purple-500/20 text-purple-300'
                        }`}>
                          {user.Rol}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Panel de Asignación de Permisos */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
              <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">⚙️</span>
              Asignar Permisos
            </h2>

            {!selectedUser ? (
              <div className="text-center py-8 sm:py-12">
                <span className="text-4xl sm:text-5xl lg:text-6xl mb-4 block">👈</span>
                <p className="text-gray-400 text-sm sm:text-base lg:text-lg">Selecciona un usuario para continuar</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Usuario seleccionado */}
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-2">Usuario seleccionado:</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedUserData?.Nombre?.charAt(0)}{selectedUserData?.Apellido?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {selectedUserData?.Nombre} {selectedUserData?.Apellido}
                      </p>
                      <p className="text-gray-400 text-sm">{selectedUserData?.Correo}</p>
                    </div>
                    <button
                      type="button"
                      onClick={clearForm}
                      className="ml-auto text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Fecha límite */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    🗓️ Fecha límite de los permisos:
                  </label>
                  <input
                    type="date"
                    value={fechaLimite}
                    onChange={(e) => setFechaLimite(e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Permisos por categoría */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Permisos disponibles:</h3>
                  
                  {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                    <div key={category} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-white font-medium mb-4 flex items-center">
                        <span className="text-xl mr-2">📋</span>
                        {category}
                      </h4>
                      <div className="space-y-3">
                        {permissions.map(permission => (
                          <label
                            key={permission.key}
                            className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={userPermissions.includes(permission.key)}
                              onChange={() => handlePermissionChange(permission.key)}
                              className="w-5 h-5 text-green-500 bg-white/10 border-white/30 rounded focus:ring-green-500 focus:ring-2"
                            />
                            <span className="text-2xl">{permission.icon}</span>
                            <span className="text-white font-medium flex-1">
                              {permission.description}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botones */}
                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={clearForm}
                    className="flex-1 px-6 py-3 bg-gray-500/20 text-gray-300 rounded-xl hover:bg-gray-500/30 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || userPermissions.length === 0}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                      </span>
                    ) : (
                      '💾 Guardar Permisos'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsManager; 