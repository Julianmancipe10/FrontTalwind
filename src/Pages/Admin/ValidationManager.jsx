import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingValidations, approveValidation, rejectValidation } from '../../services/auth';

const ValidationManager = () => {
  const navigate = useNavigate();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [observaciones, setObservaciones] = useState({});

  const handleGoBack = () => {
    navigate(-1); // Navegar hacia atrás en el historial
  };

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      setLoading(true);
      const requests = await getPendingValidations();
      setPendingRequests(requests);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleObservacionChange = (solicitudId, value) => {
    setObservaciones(prev => ({
      ...prev,
      [solicitudId]: value
    }));
  };

  const handleApprove = async (solicitudId) => {
    try {
      setProcessingId(solicitudId);
      setError('');
      
      await approveValidation(solicitudId, observaciones[solicitudId] || '');
      
      // Recargar la lista
      await loadPendingRequests();
      
      // Limpiar observaciones
      setObservaciones(prev => {
        const updated = { ...prev };
        delete updated[solicitudId];
        return updated;
      });
      
    } catch (error) {
      setError(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (solicitudId) => {
    try {
      const obs = observaciones[solicitudId];
      if (!obs || obs.trim() === '') {
        setError('Las observaciones son requeridas para rechazar una solicitud');
        return;
      }

      setProcessingId(solicitudId);
      setError('');
      
      await rejectValidation(solicitudId, obs);
      
      // Recargar la lista
      await loadPendingRequests();
      
      // Limpiar observaciones
      setObservaciones(prev => {
        const updated = { ...prev };
        delete updated[solicitudId];
        return updated;
      });
      
    } catch (error) {
      setError(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeColor = (rol) => {
    switch (rol) {
      case 'instructor':
        return 'bg-blue-900/50 text-blue-300 border-blue-500';
      case 'funcionario':
        return 'bg-purple-900/50 text-purple-300 border-purple-500';
      default:
        return 'bg-gray-900/50 text-gray-300 border-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1f2e] p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header con botón de volver */}
          <div className="flex items-center mb-8">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 mr-4"
            >
              <i className="fas fa-arrow-left text-lg"></i>
              <span className="hidden sm:inline">Volver</span>
            </button>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white">
                Gestión de Validaciones
              </h1>
            </div>
          </div>
          
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f2e] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header con botón de volver */}
        <div className="flex items-start gap-4 mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 mt-1 flex-shrink-0"
          >
            <i className="fas fa-arrow-left text-lg"></i>
            <span className="hidden sm:inline">Volver</span>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">
              Gestión de Validaciones
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Revisa y gestiona las solicitudes de registro de instructores y funcionarios
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 sm:p-4 bg-red-900/50 border-l-4 border-red-500 text-red-200 text-sm sm:text-base">
            {error}
          </div>
        )}

        {pendingRequests.length === 0 ? (
          <div className="bg-[#1e2536] rounded-xl p-6 sm:p-8 text-center">
            <div className="text-gray-400 text-xl mb-2">
              <i className="fas fa-check-circle text-green-400 text-2xl sm:text-3xl mb-4"></i>
            </div>
            <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">
              No hay solicitudes pendientes
            </h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Todas las solicitudes de validación han sido procesadas.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingRequests.map((request) => (
              <div 
                key={request.idSolicitud} 
                className="bg-[#1e2536] rounded-xl p-4 sm:p-6 border border-gray-700"
              >
                <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
                  {/* Información del Usuario */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-black font-bold text-sm sm:text-lg">
                          {request.Nombre.charAt(0)}{request.Apellido.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-white font-semibold text-base sm:text-lg truncate">
                          {request.Nombre} {request.Apellido}
                        </h3>
                        <div className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs border ${getRoleBadgeColor(request.TipoRol)}`}>
                          {request.TipoRol.charAt(0).toUpperCase() + request.TipoRol.slice(1)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <span className="text-gray-400">Correo:</span>
                        <p className="text-white font-medium break-all">{request.Correo}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Documento:</span>
                        <p className="text-white font-medium">{request.Documento}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Fecha de Registro:</span>
                        <p className="text-white font-medium">
                          {formatDate(request.FechaRegistro)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Fecha de Solicitud:</span>
                        <p className="text-white font-medium">
                          {formatDate(request.FechaSolicitud)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Panel de Acciones */}
                  <div className="xl:w-80 w-full">
                    <div className="bg-[#252b3b] rounded-lg p-3 sm:p-4">
                      <h4 className="text-white font-semibold mb-3 text-sm sm:text-base">Acciones</h4>
                      
                      <div className="mb-4">
                        <label className="block text-xs sm:text-sm text-gray-300 mb-2">
                          Observaciones
                        </label>
                        <textarea
                          value={observaciones[request.idSolicitud] || ''}
                          onChange={(e) => handleObservacionChange(request.idSolicitud, e.target.value)}
                          placeholder="Ingresa observaciones (opcional para aprobar, requerido para rechazar)"
                          className="w-full px-3 py-2 rounded-lg bg-[#1e2536] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-xs sm:text-sm"
                          rows="3"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleApprove(request.idSolicitud)}
                          disabled={processingId === request.idSolicitud}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                        >
                          {processingId === request.idSolicitud ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <>
                              <i className="fas fa-check mr-1 sm:mr-2"></i>
                              Aprobar
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleReject(request.idSolicitud)}
                          disabled={processingId === request.idSolicitud}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                        >
                          {processingId === request.idSolicitud ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <>
                              <i className="fas fa-times mr-1 sm:mr-2"></i>
                              Rechazar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 sm:mt-8 text-center">
          <button
            onClick={loadPendingRequests}
            className="bg-[#1e2536] hover:bg-[#252b3b] text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition duration-300 border border-gray-700 text-sm sm:text-base"
          >
            <i className="fas fa-sync-alt mr-1 sm:mr-2"></i>
            <span className="hidden sm:inline">Actualizar Lista</span>
            <span className="sm:hidden">Actualizar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationManager; 