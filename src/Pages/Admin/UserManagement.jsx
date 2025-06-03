import React, { useState, useEffect } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISOS } from '../../constants/roles';
import axios from 'axios';
import './UserManagement.css';

const UserManagement = () => {
  const { hasPermission } = usePermissions();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    documento: '',
    password: '',
    rol: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/users', formData);
      setSuccess('Usuario creado exitosamente');
      setShowCreateForm(false);
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      setSuccess('Usuario eliminado exitosamente');
      fetchUsers();
    } catch (error) {
      setError('Error al eliminar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h2>Gestión de Usuarios</h2>
        {hasPermission(PERMISOS.CREAR_USUARIO) && (
          <button 
            className="action-button"
            onClick={() => setShowCreateForm(true)}
          >
            Crear Usuario
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showCreateForm && (
        <div className="create-user-form">
          <h3>Crear Nuevo Usuario</h3>
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Apellido:</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Correo:</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Documento:</label>
              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Rol:</label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Instructor">Instructor</option>
                <option value="Aprendiz">Aprendiz</option>
                <option value="Funcionario">Funcionario</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="action-button" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Usuario'}
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setShowCreateForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {hasPermission(PERMISOS.VER_USUARIO) && (
        <div className="users-list">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Documento</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.idUsuario}>
                  <td>{user.Nombre}</td>
                  <td>{user.Apellido}</td>
                  <td>{user.Correo}</td>
                  <td>{user.Documento}</td>
                  <td>{user.Rol}</td>
                  <td>
                    {hasPermission(PERMISOS.EDITAR_USUARIO) && (
                      <button className="edit-button">Editar</button>
                    )}
                    {hasPermission(PERMISOS.ELIMINAR_USUARIO) && (
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteUser(user.idUsuario)}
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 