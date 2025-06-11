import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISOS } from '../../constants/roles';

const UsersList = ({ refreshTrigger }) => {
  const { hasPermission } = usePermissions();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
      setError('');
    } catch (error) {
      setError('Error al cargar usuarios');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${userName}? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      await fetchUsers(); // Recargar la lista
    } catch (error) {
      setError('Error al eliminar usuario');
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'administrador':
        return 'bg-red-900/30 text-red-300 border-red-600';
      case 'instructor':
        return 'bg-blue-900/30 text-blue-300 border-blue-600';
      case 'funcionario':
        return 'bg-purple-900/30 text-purple-300 border-purple-600';
      case 'aprendiz':
        return 'bg-green-900/30 text-green-300 border-green-600';
      default:
        return 'bg-gray-900/30 text-gray-300 border-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'activo':
        return 'bg-green-900/30 text-green-300 border-green-600';
      case 'pendiente':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-600';
      case 'rechazado':
        return 'bg-red-900/30 text-red-300 border-red-600';
      default:
        return 'bg-gray-900/30 text-gray-300 border-gray-600';
    }
  };

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.Rol?.toLowerCase() === filterRole;
    const matchesSearch = 
      user.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Documento?.includes(searchTerm);
    
    return matchesRole && matchesSearch;
  });

  if (loading) {
    return (
      <div className="bg-[#252b3b] rounded-lg p-8">
        <div className="flex items-center justify-center">
          <i className="fas fa-spinner fa-spin text-2xl text-[#39B54A] mr-3"></i>
          <span className="text-gray-300">Cargando usuarios...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#252b3b] rounded-lg p-4 sm:p-6">
      <style jsx>{`
        /* Estilos para el scroll */
        .scroll-container::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .scroll-container::-webkit-scrollbar-track {
          background: #1e2536;
          border-radius: 4px;
        }
        .scroll-container::-webkit-scrollbar-thumb {
          background: #39B54A;
          border-radius: 4px;
        }
        .scroll-container::-webkit-scrollbar-thumb:hover {
          background: #2d8f37;
        }
        .scroll-container::-webkit-scrollbar-corner {
          background: #1e2536;
        }
      `}</style>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Buscador */}
        <div className="flex-1">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Buscar por nombre, apellido, correo o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1e2536] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39B54A] focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Filtro de rol */}
        <div className="w-full sm:w-48">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full px-3 py-2 bg-[#1e2536] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#39B54A] focus:border-transparent transition-all duration-200"
          >
            <option value="all">Todos los roles</option>
            <option value="administrador">Administrador</option>
            <option value="instructor">Instructor</option>
            <option value="funcionario">Funcionario</option>
            <option value="aprendiz">Aprendiz</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-4 flex items-center">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      )}

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <i className="fas fa-users text-4xl text-gray-600 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No se encontraron usuarios</h3>
          <p className="text-gray-500">
            {searchTerm || filterRole !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'No hay usuarios registrados en el sistema'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <div className="overflow-auto max-h-96 border border-gray-700 rounded-lg scroll-container">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-[#1e2536] sticky top-0 z-10">
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium w-[220px]">Usuario</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium w-[280px]">Correo</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium w-[140px]">Documento</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium w-[140px]">Rol</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium w-[120px]">Estado</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium w-[100px]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.idUsuario} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors duration-200">
                      <td className="py-4 px-4 w-[220px]">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-[#39B54A] rounded-full flex items-center justify-center text-white font-semibold mr-3 flex-shrink-0">
                            {user.Nombre?.charAt(0)}{user.Apellido?.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-white font-medium truncate" title={`${user.Nombre} ${user.Apellido}`}>
                              {user.Nombre} {user.Apellido}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-300 w-[280px]">
                        <div className="truncate" title={user.Correo}>{user.Correo}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-300 w-[140px]">{user.Documento}</td>
                      <td className="py-4 px-4 w-[140px]">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getRoleColor(user.Rol)} whitespace-nowrap`}>
                          {user.Rol}
                        </span>
                      </td>
                      <td className="py-4 px-4 w-[120px]">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(user.EstadoCuenta)} whitespace-nowrap`}>
                          {user.EstadoCuenta || 'Activo'}
                        </span>
                      </td>
                      <td className="py-4 px-4 w-[100px]">
                        <div className="flex justify-center">
                          {hasPermission(PERMISOS.ELIMINAR_USUARIO) && (
                            <button
                              onClick={() => handleDeleteUser(user.idUsuario, `${user.Nombre} ${user.Apellido}`)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded-lg transition-colors duration-200 flex-shrink-0"
                              title="Eliminar usuario"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Indicador de scroll horizontal */}
            <div className="mt-3 flex justify-center">
              <div className="flex items-center text-xs text-gray-400">
                <div className="w-4 h-px bg-[#39B54A] mr-2"></div>
                <span>Scroll horizontal</span>
                <i className="fas fa-arrows-alt-h text-[#39B54A] ml-2"></i>
              </div>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 max-h-96 overflow-y-auto pr-2 scroll-container" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#39B54A #1e2536'
          }}>
            {filteredUsers.map(user => (
              <div key={user.idUsuario} className="bg-[#1e2536] rounded-lg p-4 border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#39B54A] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {user.Nombre?.charAt(0)}{user.Apellido?.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-medium text-lg">{user.Nombre} {user.Apellido}</div>
                      <div className="text-gray-400 text-sm">{user.Correo}</div>
                    </div>
                  </div>
                  {hasPermission(PERMISOS.ELIMINAR_USUARIO) && (
                    <button
                      onClick={() => handleDeleteUser(user.idUsuario, `${user.Nombre} ${user.Apellido}`)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded-lg transition-colors duration-200"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Documento:</span>
                    <div className="text-white">{user.Documento}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Rol:</span>
                    <div>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getRoleColor(user.Rol)}`}>
                        {user.Rol}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400">Estado:</span>
                    <div>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(user.EstadoCuenta)}`}>
                        {user.EstadoCuenta || 'Activo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          


          {/* Información de resultados */}
          <div className="mt-6 text-center text-gray-400 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-1 h-1 bg-[#39B54A] rounded-full"></div>
              <span>Mostrando {filteredUsers.length} de {users.length} usuarios</span>
              <div className="w-1 h-1 bg-[#39B54A] rounded-full"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersList; 