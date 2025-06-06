import React, { useState, useEffect } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISOS } from '../../constants/roles';
import axios from 'axios';

const PermissionsManager = () => {
  const { hasPermission } = usePermissions();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [fechaLimite, setFechaLimite] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchPermissions();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserPermissions(selectedUser);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      setError('Error al cargar usuarios');
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/permissions');
      setAvailablePermissions(response.data);
    } catch (error) {
      setError('Error al cargar permisos');
    }
  };

  const fetchUserPermissions = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/permissions/user/${userId}`);
      setUserPermissions(response.data.map(p => p.ID_Permiso));
    } catch (error) {
      setError('Error al cargar permisos del usuario');
    }
  };

  const handlePermissionChange = (permissionId) => {
    setUserPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
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
      });
      setSuccess('Permisos actualizados exitosamente');
    } catch (error) {
      setError('Error al actualizar permisos');
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission(PERMISOS.ASIGNAR_PERMISOS)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <p className="text-lg text-gray-700">No tienes permiso para acceder a esta página</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Gestión de Permisos
        </h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Usuario:
            </label>
            <select 
              value={selectedUser || ''} 
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Seleccione un usuario</option>
              {users.map(user => (
                <option key={user.idUsuario} value={user.idUsuario}>
                  {user.Nombre} {user.Apellido} - {user.Correo}
                </option>
              ))}
            </select>
          </div>

          {selectedUser && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Límite:
                </label>
                <input
                  type="date"
                  value={fechaLimite}
                  onChange={(e) => setFechaLimite(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Permisos Disponibles
                </h3>
                <div className="space-y-3">
                  {availablePermissions.map(permiso => (
                    <div key={permiso.ID_Permiso} 
                         className="flex items-center p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                      <label className="flex items-center space-x-3 cursor-pointer w-full">
                        <input
                          type="checkbox"
                          checked={userPermissions.includes(permiso.ID_Permiso)}
                          onChange={() => handlePermissionChange(permiso.ID_Permiso)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700">{permiso.Nombre}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-sm font-semibold text-center transition-colors duration-150
                  ${loading 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600 text-white'}`}
              >
                {loading ? 'Guardando...' : 'Guardar Permisos'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionsManager; 