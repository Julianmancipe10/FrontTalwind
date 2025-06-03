import React, { useState } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISOS } from '../../constants/roles';
import { Header } from '../../Layouts/Header/Header';
import './AdminPanel.css';

const AdminPanel = () => {
  const { hasPermission } = usePermissions();
  const [activeTab, setActiveTab] = useState('users');

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="admin-section">
            <h2>Gestión de Usuarios</h2>
            {hasPermission(PERMISOS.CREAR_USUARIO) && (
              <button className="action-button">Crear Usuario</button>
            )}
            {hasPermission(PERMISOS.VER_USUARIO) && (
              <div className="users-list">
                {/* Lista de usuarios */}
              </div>
            )}
          </div>
        );

      case 'permissions':
        return (
          <div className="admin-section">
            <h2>Gestión de Permisos</h2>
            {hasPermission(PERMISOS.ASIGNAR_PERMISOS) && (
              <div className="permissions-management">
                {/* Gestión de permisos */}
              </div>
            )}
          </div>
        );

      case 'roles':
        return (
          <div className="admin-section">
            <h2>Gestión de Roles</h2>
            {hasPermission(PERMISOS.ASIGNAR_ROLES) && (
              <div className="roles-management">
                {/* Gestión de roles */}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-panel">
      <Header />
      <div className="admin-container">
        <div className="admin-sidebar">
          <button 
            className={`sidebar-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Usuarios
          </button>
          <button 
            className={`sidebar-button ${activeTab === 'permissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('permissions')}
          >
            Permisos
          </button>
          <button 
            className={`sidebar-button ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            Roles
          </button>
        </div>
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;