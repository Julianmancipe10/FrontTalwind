import React, { useState, useRef, useEffect } from 'react';
import { crearCalificacion, verificarEstudiante } from '../services/calificacionService';

const CalificacionModal = ({ instructores, currentUser, onClose }) => {
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [documento, setDocumento] = useState('');
  const [estudianteVerificado, setEstudianteVerificado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const timeoutRef = useRef(null);

  const isLoggedStudent = currentUser && currentUser.rol === 'aprendiz';

  // Verificar estudiante por documento
  const handleVerificarEstudiante = async () => {
    if (!documento.trim()) {
      setError('Por favor, ingresa tu número de documento');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const estudiante = await verificarEstudiante(documento.trim());
      setEstudianteVerificado(estudiante);
      setSuccess(`¡Hola ${estudiante.nombre} ${estudiante.apellido}! Ahora puedes calificar.`);
    } catch (error) {
      setError(error.message);
      setEstudianteVerificado(null);
    } finally {
      setLoading(false);
    }
  };

  // Manejar envío de calificación
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!selectedInstructor) {
      setError('Por favor, selecciona un instructor');
      return;
    }

    if (calificacion === 0) {
      setError('Por favor, selecciona una calificación');
      return;
    }

    if (!isLoggedStudent && !estudianteVerificado) {
      setError('Por favor, verifica tu documento primero');
      return;
    }

    const calificacionData = {
      instructorId: parseInt(selectedInstructor),
      calificacion,
      comentario: comentario.trim() || null
    };

    // Si no está logueado, agregar documento
    if (!isLoggedStudent) {
      calificacionData.documento = documento;
    }

    try {
      setLoading(true);
      await crearCalificacion(calificacionData);
      setSuccess('¡Calificación enviada exitosamente! Gracias por tu opinión.');
      
      // Limpiar formulario después de 2 segundos
      timeoutRef.current = setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Renderizar estrellas para selección
  const renderStarSelector = () => {
    return (
      <div className="flex justify-center gap-1 sm:gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setCalificacion(star)}
            className={`text-4xl sm:text-5xl transition-all duration-300 transform hover:scale-110 ${
              star <= calificacion 
                ? 'text-yellow-400 drop-shadow-lg' 
                : 'text-gray-300 hover:text-yellow-300'
            }`}
            style={{
              filter: star <= calificacion ? 'drop-shadow(0 0 8px rgba(255, 193, 7, 0.6))' : 'none'
            }}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#1a1f2e] rounded-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-600 transform transition-all duration-300">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gradient-to-r from-sena-green to-sena-green-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sena-green to-sena-green-dark rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">⭐</span>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-sena-green-dark to-sena-green bg-clip-text text-transparent">
                  Calificar Instructor
                </h2>
                <p className="text-sm text-gray-300">Tu opinión es muy importante</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 text-3xl transition-colors duration-200 hover:bg-red-50 rounded-full w-10 h-10 flex items-center justify-center"
              disabled={loading}
            >
              ×
            </button>
          </div>

          {/* Mensajes */}
          {error && (
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 border-l-4 border-red-500 text-white px-4 py-3 rounded-lg mb-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-red-400 text-lg">⚠️</span>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 border-l-4 border-sena-green text-white px-4 py-3 rounded-lg mb-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-sena-green text-lg">✅</span>
                <span className="font-medium">{success}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Verificación de documento (solo si no está logueado como aprendiz) */}
            {!isLoggedStudent && (
              <div className="mb-6 p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-blue-500 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">🆔</span>
                  </div>
                  <h3 className="font-bold text-white text-lg">
                    Verificación de Estudiante
                  </h3>
                </div>
                <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                  Para calificar, debes ser un <span className="font-semibold text-sena-green">aprendiz registrado</span>. Ingresa tu número de documento:
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    placeholder="Número de documento"
                    className="flex-1 px-4 py-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-sena-green focus:border-sena-green transition-all duration-200 bg-gray-700 text-white placeholder-gray-400 shadow-sm"
                    disabled={loading || estudianteVerificado}
                  />
                  <button
                    type="button"
                    onClick={handleVerificarEstudiante}
                    disabled={loading || estudianteVerificado || !documento.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-sena-green-dark to-sena-green text-white rounded-lg hover:from-sena-green hover:to-sena-green-dark disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-sm"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Verificando...
                      </div>
                    ) : 'Verificar'}
                  </button>
                </div>
                
                {estudianteVerificado && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-gray-700 to-gray-600 border border-sena-green rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-sena-green text-lg">✅</span>
                      <p className="text-white font-semibold">
                        Estudiante verificado: <span className="text-sena-green">{estudianteVerificado.nombre} {estudianteVerificado.apellido}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Información del usuario logueado */}
            {isLoggedStudent && (
              <div className="mb-6 p-4 bg-gradient-to-r from-gray-800 to-gray-700 border border-sena-green rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-sena-green to-sena-green-dark rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">👨‍🎓</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">
                      ¡Hola, {currentUser.nombre} {currentUser.apellido}!
                    </p>
                    <p className="text-sm text-gray-300">
                      Logueado como <span className="font-medium text-sena-green">Aprendiz</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Selección de instructor */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                <span className="text-sena-green text-lg">👨‍🏫</span>
                Seleccionar Instructor *
              </label>
              <select
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-sena-green focus:border-sena-green transition-all duration-200 bg-gray-700 text-white shadow-sm font-medium"
                disabled={loading}
                required
              >
                <option value="" className="text-gray-400 bg-gray-700">🎯 Selecciona un instructor...</option>
                {instructores.map((instructor) => (
                  <option key={instructor.id} value={instructor.id} className="text-white bg-gray-700">
                    👨‍🏫 {instructor.nombre} {instructor.apellido} - {instructor.especialidad || instructor.rol}
                  </option>
                ))}
              </select>
            </div>

            {/* Calificación con estrellas */}
            <div className="mb-6 p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-yellow-500 shadow-sm">
              <label className="flex items-center justify-center gap-2 text-sm font-bold text-white mb-4">
                <span className="text-yellow-400 text-lg">⭐</span>
                Calificación *
              </label>
              {renderStarSelector()}
              <div className="text-center">
                <p className={`text-lg font-bold mb-2 transition-all duration-300 ${
                  calificacion === 0 ? 'text-gray-500' :
                  calificacion === 1 ? 'text-red-500' :
                  calificacion === 2 ? 'text-red-400' :
                  calificacion === 3 ? 'text-yellow-500' :
                  calificacion === 4 ? 'text-green-500' :
                  'text-sena-green'
                }`}>
                  {calificacion === 0 && '🤔 Selecciona una calificación'}
                  {calificacion === 1 && '😞 Muy malo'}
                  {calificacion === 2 && '😐 Malo'}
                  {calificacion === 3 && '🙂 Regular'}
                  {calificacion === 4 && '😊 Bueno'}
                  {calificacion === 5 && '🤩 Excelente'}
                </p>
                {calificacion > 0 && (
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    calificacion <= 2 ? 'bg-red-100 text-red-800' :
                    calificacion === 3 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    <span>{calificacion}</span>
                    <span>{'★'.repeat(calificacion)}{'☆'.repeat(5 - calificacion)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Comentario */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                <span className="text-blue-400 text-lg">💬</span>
                Comentario (opcional)
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value.slice(0, 500))}
                placeholder="💭 Comparte tu experiencia con este instructor: ¿Qué te gustó más? ¿Cómo fue su metodología de enseñanza?"
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-sena-green focus:border-sena-green transition-all duration-200 bg-gray-700 text-white placeholder-gray-400 shadow-sm resize-none"
                disabled={loading}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-300">
                  Tu comentario ayuda a otros estudiantes
                </p>
                <p className="text-xs text-gray-400">
                  {comentario.length}/500 caracteres
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-600">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-500 text-gray-300 rounded-lg hover:bg-gray-600 hover:border-gray-400 hover:text-white disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                disabled={loading}
              >
                ❌ Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || (!isLoggedStudent && !estudianteVerificado) || calificacion === 0 || !selectedInstructor}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-sena-green-dark to-sena-green text-white rounded-lg hover:from-sena-green hover:to-sena-green-dark disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none sena-green-glow"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>⭐</span>
                    Enviar Calificación
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CalificacionModal; 