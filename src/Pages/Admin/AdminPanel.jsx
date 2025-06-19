import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISOS } from '../../constants/roles';
import { Header } from '../../Layouts/Header/Header';
import { getCurrentUser } from '../../services/auth';
import CreateUserForm from './CreateUserForm';
import UsersList from './UsersList';
import PermissionsManager from './PermissionsManager';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [activeTab, setActiveTab] = useState('users');
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const user = getCurrentUser();
  const isAdmin = user?.rol === 'administrador';

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCreateUserSuccess = (message) => {
    setSuccessMessage(message);
    setShowCreateUserForm(false);
    setRefreshTrigger(prev => prev + 1);
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white">Gestión de Usuarios</h2>
                <p className="text-gray-300 text-sm sm:text-base">
                  Administra los usuarios del sistema, crea nuevos instructores y funcionarios.
                </p>
              </div>
              {hasPermission(PERMISOS.CREAR_USUARIO) && (
                <button 
                  onClick={() => setShowCreateUserForm(true)}
                  className="w-full sm:w-auto px-4 py-2 bg-[#39B54A] hover:bg-[#2d8f37] text-white rounded-lg transition-colors duration-200 font-medium shadow-sm text-sm sm:text-base"
                >
                  <i className="fas fa-user-plus mr-2"></i>
                  Crear Usuario
                </button>
              )}
            </div>

            {successMessage && (
              <div className="bg-green-900/50 border border-green-600 text-green-300 px-4 py-3 rounded-lg flex items-center">
                <i className="fas fa-check-circle mr-2"></i>
                {successMessage}
              </div>
            )}

            {hasPermission(PERMISOS.VER_USUARIO) && (
              <UsersList refreshTrigger={refreshTrigger} />
            )}
          </div>
        );

      case 'permissions':
        return (
          <div className="space-y-4 sm:space-y-6">
            {hasPermission(PERMISOS.ASIGNAR_PERMISOS) ? (
              <PermissionsManager />
            ) : (
              <div className="bg-[#252b3b] rounded-lg p-6 text-center">
                <div className="text-red-400 text-5xl mb-4">🔒</div>
                <h3 className="text-white font-medium mb-3">Sin permisos suficientes</h3>
                <p className="text-gray-400 text-sm">No tienes autorización para gestionar permisos</p>
              </div>
            )}
          </div>
        );



      case 'validations':
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Gestión de Validaciones</h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Gestiona las solicitudes de registro de instructores y funcionarios que requieren validación administrativa.
            </p>
            <div className="bg-[#252b3b] rounded-lg p-4 sm:p-6">
              <h3 className="text-white font-medium mb-3">Solicitudes Pendientes</h3>
              <p className="text-gray-400 text-sm mb-4">
                Revisa y aprueba o rechaza las solicitudes de nuevos instructores y funcionarios.
              </p>
              <Link 
                to="/admin/validaciones"
                className="inline-block w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-[#39B54A] hover:bg-[#2d8f37] text-white rounded-lg transition-colors duration-200 font-medium shadow-sm text-sm sm:text-base text-center"
              >
                <i className="fas fa-user-check mr-2"></i>
                <span className="hidden sm:inline">Ver Solicitudes Pendientes</span>
                <span className="sm:hidden">Ver Solicitudes</span>
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1f2e] overflow-x-hidden">
      <Header />
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:px-6 lg:px-8 max-w-7xl">
        {/* Header con botón de volver */}
        <div className="flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 mt-1 flex-shrink-0"
          >
            <i className="fas fa-arrow-left text-lg"></i>
            <span className="hidden sm:inline text-sm">Volver</span>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 truncate">
              Panel de Administración
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Gestiona usuarios, permisos, roles y validaciones del sistema
            </p>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64 xl:w-72 lg:flex-shrink-0">
            {/* Navegación móvil - Diseño tipo grid para pantallas muy pequeñas */}
            <div className="lg:hidden mb-4">
              {/* Grid para pantallas pequeñas */}
              <div className="grid grid-cols-2 gap-2 sm:hidden">
                <button 
                  className={`w-full px-2 py-2 text-center rounded-lg font-medium transition-colors duration-200 text-xs
                    ${activeTab === 'users' 
                      ? 'bg-[#39B54A] text-white shadow-lg' 
                      : 'bg-[#1e2536] hover:bg-[#252b3b] text-gray-300 border border-gray-700'}`}
                  onClick={() => setActiveTab('users')}
                >
                  <i className="fas fa-users mr-1"></i>
                  Usuarios
                </button>
                <button 
                  className={`w-full px-2 py-2 text-center rounded-lg font-medium transition-colors duration-200 text-xs
                    ${activeTab === 'permissions' 
                      ? 'bg-[#39B54A] text-white shadow-lg' 
                      : 'bg-[#1e2536] hover:bg-[#252b3b] text-gray-300 border border-gray-700'}`}
                  onClick={() => setActiveTab('permissions')}
                >
                  <i className="fas fa-key mr-1"></i>
                  Permisos
                </button>
                {isAdmin && (
                  <button 
                    className={`w-full px-2 py-2 text-center rounded-lg font-medium transition-colors duration-200 text-xs
                      ${activeTab === 'validations' 
                        ? 'bg-[#39B54A] text-white shadow-lg' 
                        : 'bg-[#1e2536] hover:bg-[#252b3b] text-gray-300 border border-gray-700'}`}
                    onClick={() => setActiveTab('validations')}
                  >
                    <i className="fas fa-user-check mr-1"></i>
                    Validaciones
                  </button>
                )}
              </div>
              
              {/* Scroll horizontal para pantallas medianas */}
              <div className="hidden sm:flex sm:gap-2 overflow-x-auto pb-3 px-1" style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}>
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <button 
                  className={`flex-shrink-0 min-w-max px-3 py-2 text-center rounded-lg font-medium transition-colors duration-200 text-sm whitespace-nowrap
                    ${activeTab === 'users' 
                      ? 'bg-[#39B54A] text-white shadow-lg' 
                      : 'bg-[#1e2536] hover:bg-[#252b3b] text-gray-300 border border-gray-700'}`}
                  onClick={() => setActiveTab('users')}
                >
                  <i className="fas fa-users mr-1"></i>
                  Usuarios
                </button>
                <button 
                  className={`flex-shrink-0 min-w-max px-3 py-2 text-center rounded-lg font-medium transition-colors duration-200 text-sm whitespace-nowrap
                    ${activeTab === 'permissions' 
                      ? 'bg-[#39B54A] text-white shadow-lg' 
                      : 'bg-[#1e2536] hover:bg-[#252b3b] text-gray-300 border border-gray-700'}`}
                  onClick={() => setActiveTab('permissions')}
                >
                  <i className="fas fa-key mr-1"></i>
                  Permisos
                </button>
                {isAdmin && (
                  <button 
                    className={`flex-shrink-0 min-w-max px-3 py-2 text-center rounded-lg font-medium transition-colors duration-200 text-sm whitespace-nowrap
                      ${activeTab === 'validations' 
                        ? 'bg-[#39B54A] text-white shadow-lg' 
                        : 'bg-[#1e2536] hover:bg-[#252b3b] text-gray-300 border border-gray-700'}`}
                    onClick={() => setActiveTab('validations')}
                  >
                    <i className="fas fa-user-check mr-1"></i>
                    Validaciones
                  </button>
                )}
              </div>
            </div>
            
            {/* Navegación desktop */}
            <div className="hidden lg:block space-y-2">
              <button 
                className={`w-full px-4 py-3 text-left rounded-lg font-medium transition-colors duration-200 text-sm
                  ${activeTab === 'users' 
                    ? 'bg-[#39B54A] text-white' 
                    : 'bg-[#1e2536] hover:bg-[#252b3b] text-gray-300 border border-gray-700'}`}
                onClick={() => setActiveTab('users')}
              >
                <i className="fas fa-users mr-2"></i>
                Usuarios
              </button>
              <button 
                className={`w-full px-4 py-3 text-left rounded-lg font-medium transition-colors duration-200 text-sm
                  ${activeTab === 'permissions' 
                    ? 'bg-[#39B54A] text-white' 
                    : 'bg-[#1e2536] hover:bg-[#252b3b] text-gray-300 border border-gray-700'}`}
                onClick={() => setActiveTab('permissions')}
              >
                <i className="fas fa-key mr-2"></i>
                Permisos
              </button>
              
              {/* Solo mostrar validaciones para administradores */}
              {isAdmin && (
                <button 
                  className={`w-full px-4 py-3 text-left rounded-lg font-medium transition-colors duration-200 text-sm
                    ${activeTab === 'validations' 
                      ? 'bg-[#39B54A] text-white' 
                      : 'bg-[#1e2536] hover:bg-[#252b3b] text-gray-300 border border-gray-700'}`}
                  onClick={() => setActiveTab('validations')}
                >
                  <i className="fas fa-user-check mr-2"></i>
                  Validaciones
                </button>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 bg-[#1e2536] rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700 min-w-0">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Modal de crear usuario */}
      {showCreateUserForm && (
        <CreateUserForm
          onSuccess={handleCreateUserSuccess}
          onClose={() => setShowCreateUserForm(false)}
        />
      )}
    </div>
  );
};

export default AdminPanel;