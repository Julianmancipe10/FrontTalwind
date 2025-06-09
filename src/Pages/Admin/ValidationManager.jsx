import React, { useState, useEffect } from 'react';
import { getPendingValidations, approveValidation, rejectValidation } from '../../services/auth';

const ValidationManager = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [observaciones, setObservaciones] = useState({});

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const requests = await getPendingValidations();
      setPendingRequests(requests);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      setError('Error al cargar las solicitudes pendientes. ' + error.message);
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
      setSuccess('');
      
      await approveValidation(solicitudId, observaciones[solicitudId] || '');
      
      setSuccess('Solicitud aprobada exitosamente');
      
      // Recargar la lista
      await loadPendingRequests();
      
      // Limpiar observaciones
      setObservaciones(prev => {
        const updated = { ...prev };
        delete updated[solicitudId];
        return updated;
      });
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
      let errorMessage = 'Error al aprobar la solicitud';
      
      if (error.message.includes('timeout')) {
        errorMessage = 'Error de conexión con la base de datos. Por favor, intenta nuevamente.';
      } else if (error.message.includes('ya ha sido procesada')) {
        errorMessage = 'Esta solicitud ya ha sido procesada por otro administrador.';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      
      setError(errorMessage);
      
      // Recargar lista para mostrar estado actualizado
      await loadPendingRequests();
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
      setSuccess('');
      
      await rejectValidation(solicitudId, obs);
      
      setSuccess('Solicitud rechazada exitosamente');
      
      // Recargar la lista
      await loadPendingRequests();
      
      // Limpiar observaciones
      setObservaciones(prev => {
        const updated = { ...prev };
        delete updated[solicitudId];
        return updated;
      });
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
      let errorMessage = 'Error al rechazar la solicitud';
      
      if (error.message.includes('ya procesada')) {
        errorMessage = 'Esta solicitud ya ha sido procesada por otro administrador.';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      
      setError(errorMessage);
      
      // Recargar lista para mostrar estado actualizado
      await loadPendingRequests();
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

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1f2e] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-400"></div>
            <span className="ml-4 text-white text-lg">Cargando solicitudes...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f2e] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Gestión de Validaciones
          </h1>
          <p className="text-gray-300">
            Revisa y gestiona las solicitudes de registro de instructores y funcionarios
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border-l-4 border-red-500 text-red-200 relative">
            <button 
              onClick={clearMessages}
              className="absolute top-2 right-2 text-red-400 hover:text-red-200"
            >
              <i className="fas fa-times"></i>
            </button>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/50 border-l-4 border-green-500 text-green-200 relative">
            <button 
              onClick={clearMessages}
              className="absolute top-2 right-2 text-green-400 hover:text-green-200"
            >
              <i className="fas fa-times"></i>
            </button>
            {success}
          </div>
        )}

        {pendingRequests.length === 0 ? (
          <div className="bg-[#1e2536] rounded-xl p-8 text-center">
            <div className="text-gray-400 text-xl mb-2">
              <i className="fas fa-check-circle text-green-400 text-3xl mb-4"></i>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">
              No hay solicitudes pendientes
            </h3>
            <p className="text-gray-400">
              Todas las solicitudes de validación han sido procesadas.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingRequests.map((request) => (
              <div 
                key={request.idSolicitud} 
                className="bg-[#1e2536] rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Información del Usuario */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-teal-400 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-lg">
                          {request.Nombre.charAt(0)}{request.Apellido.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">
                          {request.Nombre} {request.Apellido}
                        </h3>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs border ${getRoleBadgeColor(request.TipoRol)}`}>
                          {request.TipoRol.charAt(0).toUpperCase() + request.TipoRol.slice(1)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Correo:</span>
                        <p className="text-white font-medium">{request.Correo}</p>
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
                  <div className="lg:w-80">
                    <div className="bg-[#252b3b] rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-3">Acciones</h4>
                      
                      <div className="mb-4">
                        <label className="block text-sm text-gray-300 mb-2">
                          Observaciones
                        </label>
                        <textarea
                          value={observaciones[request.idSolicitud] || ''}
                          onChange={(e) => handleObservacionChange(request.idSolicitud, e.target.value)}
                          placeholder="Ingresa observaciones (opcional para aprobar, requerido para rechazar)"
                          className="w-full px-3 py-2 rounded-lg bg-[#1e2536] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm"
                          rows="3"
                          disabled={processingId === request.idSolicitud}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request.idSolicitud)}
                          disabled={processingId === request.idSolicitud}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center"
                        >
                          {processingId === request.idSolicitud ? (
                            <>
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                              Procesando...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-check mr-2"></i>
                              Aprobar
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleReject(request.idSolicitud)}
                          disabled={processingId === request.idSolicitud}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center"
                        >
                          {processingId === request.idSolicitud ? (
                            <>
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                              Procesando...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-times mr-2"></i>
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

        <div className="mt-8 text-center">
          <button
            onClick={loadPendingRequests}
            disabled={loading}
            className="bg-[#1e2536] hover:bg-[#252b3b] text-white font-semibold py-2 px-6 rounded-lg transition duration-300 border border-gray-700 disabled:opacity-50"
          >
            <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-sync-alt'} mr-2`}></i>
            {loading ? 'Actualizando...' : 'Actualizar Lista'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationManager; 