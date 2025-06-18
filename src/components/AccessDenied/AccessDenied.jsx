import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccessDenied = ({ message, showBackButton = true }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Acceso Denegado</h2>
          <p className="text-gray-300">
            {message || 'No tienes los permisos necesarios para acceder a esta funcionalidad.'}
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Si crees que deberías tener acceso, contacta con un administrador.
          </p>
          
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Volver
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessDenied; 