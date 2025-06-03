import React, { useState, useEffect } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISOS } from '../../constants/roles';
import axios from 'axios';
import './PermissionsManager.css';

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
    return <div>No tienes permiso para acceder a esta página</div>;
  }

  return (
    <div className="permissions-manager">
      <h2>Gestión de Permisos</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="permissions-form">
        <div className="form-group">
          <label>Seleccionar Usuario:</label>
          <select 
            value={selectedUser || ''} 
            onChange={(e) => setSelectedUser(e.target.value)}
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
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Fecha Límite:</label>
              <input
                type="date"
                value={fechaLimite}
                onChange={(e) => setFechaLimite(e.target.value)}
                required
              />
            </div>

            <div className="permissions-list">
              <h3>Permisos Disponibles</h3>
              {availablePermissions.map(permiso => (
                <div key={permiso.ID_Permiso} className="permission-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={userPermissions.includes(permiso.ID_Permiso)}
                      onChange={() => handlePermissionChange(permiso.ID_Permiso)}
                    />
                    {permiso.Nombre}
                  </label>
                </div>
              ))}
            </div>

            <button 
              type="submit" 
              className="save-button"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Permisos'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PermissionsManager; 