import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISOS } from '../../constants/roles';
import { Header } from '../../Layouts/Header/Header';
import { getCurrentUser } from '../../services/auth';

const AdminPanel = () => {
  const { hasPermission } = usePermissions();
  const [activeTab, setActiveTab] = useState('users');
  const user = getCurrentUser();
  const isAdmin = user?.rol === 'administrador';

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Gestión de Usuarios</h2>
            {hasPermission(PERMISOS.CREAR_USUARIO) && (
              <button className="px-4 py-2 bg-green-400 hover:bg-green-500 text-gray-900 rounded-lg transition-colors duration-200 font-medium shadow-sm">
                Crear Usuario
              </button>
            )}
            {hasPermission(PERMISOS.VER_USUARIO) && (
              <div className="mt-6">
                {/* Lista de usuarios */}
              </div>
            )}
          </div>
        );

      case 'permissions':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Gestión de Permisos</h2>
            {hasPermission(PERMISOS.ASIGNAR_PERMISOS) && (
              <div className="mt-6">
                {/* Gestión de permisos */}
              </div>
            )}
          </div>
        );

      case 'roles':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Gestión de Roles</h2>
            {hasPermission(PERMISOS.ASIGNAR_ROLES) && (
              <div className="mt-6">
                {/* Gestión de roles */}
              </div>
            )}
          </div>
        );

      case 'validations':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Gestión de Validaciones</h2>
            <p className="text-gray-600">
              Gestiona las solicitudes de registro de instructores y funcionarios que requieren validación administrativa.
            </p>
            <Link 
              to="/admin/validations"
              className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium shadow-sm"
            >
              <i className="fas fa-user-check mr-2"></i>
              Ver Solicitudes Pendientes
            </Link>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">Gestiona usuarios, permisos, roles y validaciones del sistema</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-3">
            <button 
              className={`w-full px-4 py-3 text-left rounded-lg font-medium transition-colors duration-200
                ${activeTab === 'users' 
                  ? 'bg-green-400 text-gray-900' 
                  : 'bg-white hover:bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('users')}
            >
              <i className="fas fa-users mr-2"></i>
              Usuarios
            </button>
            <button 
              className={`w-full px-4 py-3 text-left rounded-lg font-medium transition-colors duration-200
                ${activeTab === 'permissions' 
                  ? 'bg-green-400 text-gray-900' 
                  : 'bg-white hover:bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('permissions')}
            >
              <i className="fas fa-key mr-2"></i>
              Permisos
            </button>
            <button 
              className={`w-full px-4 py-3 text-left rounded-lg font-medium transition-colors duration-200
                ${activeTab === 'roles' 
                  ? 'bg-green-400 text-gray-900' 
                  : 'bg-white hover:bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('roles')}
            >
              <i className="fas fa-user-tag mr-2"></i>
              Roles
            </button>
            
            {/* Solo mostrar validaciones para administradores */}
            {isAdmin && (
              <button 
                className={`w-full px-4 py-3 text-left rounded-lg font-medium transition-colors duration-200
                  ${activeTab === 'validations' 
                    ? 'bg-green-400 text-gray-900' 
                    : 'bg-white hover:bg-gray-100 text-gray-700'}`}
                onClick={() => setActiveTab('validations')}
              >
                <i className="fas fa-user-check mr-2"></i>
                Validaciones
              </button>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;