import React, { useState, useEffect } from 'react';
import { getCalificacionesPorInstructor } from '../services/calificacionService';

const InstructorModal = ({ instructor, onClose }) => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [loadingCalificaciones, setLoadingCalificaciones] = useState(false);
  const [activeTab, setActiveTab] = useState('perfil');

  // Cargar calificaciones del instructor
  useEffect(() => {
    const cargarCalificaciones = async () => {
      if (instructor && activeTab === 'calificaciones') {
        try {
          setLoadingCalificaciones(true);
          const data = await getCalificacionesPorInstructor(instructor.id);
          setCalificaciones(data);
        } catch (error) {
          console.error('Error al cargar calificaciones:', error);
        } finally {
          setLoadingCalificaciones(false);
        }
      }
    };

    cargarCalificaciones();
  }, [instructor, activeTab]);

  if (!instructor) return null;

  // Obtener imagen del instructor
  const getImagenInstructor = () => {
    if (instructor.foto) {
      return `http://localhost:5000${instructor.foto}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.nombre + ' ' + instructor.apellido)}&background=4ade80&color=ffffff&size=400`;
  };

  // Renderizar estrellas
  const renderEstrellas = (calificacion) => {
    const rating = parseFloat(calificacion) || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        className={`text-lg ${
          i < Math.floor(rating) ? 'text-yellow-400' : 
          i < rating ? 'text-yellow-300' : 'text-gray-400'
        }`}
      >
        ★
      </span>
    ));
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#1a1f2e] rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-600">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#1a1f2e] to-gray-800 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-300 hover:text-red-400 text-3xl transition-colors duration-200 hover:bg-red-50/10 rounded-full w-10 h-10 flex items-center justify-center"
          >
            ×
          </button>
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Foto del instructor */}
            <div className="relative">
              <img 
                src={getImagenInstructor()} 
                alt={`${instructor.nombre} ${instructor.apellido}`}
                className="w-32 h-32 rounded-full object-cover border-4 border-sena-green shadow-2xl"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.nombre + ' ' + instructor.apellido)}&background=4ade80&color=ffffff&size=400`;
                }}
              />
              <div className="absolute -bottom-2 -right-2">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full shadow-lg ${
                  instructor.rol === 'instructor' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                }`}>
                  {instructor.rol === 'instructor' ? '👨‍🏫 Instructor' : '👔 Funcionario'}
                </span>
              </div>
            </div>

            {/* Información básica */}
            <div className="text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
                {instructor.nombre} {instructor.apellido}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <span className="text-sena-green text-lg">💼</span>
                <p className="text-xl text-sena-green font-semibold">
                  {instructor.especialidad || 'Especialidad no especificada'}
                </p>
              </div>
              
              {/* Calificación */}
              <div className="flex justify-center md:justify-start items-center gap-3 mb-3">
                <div className="flex">
                  {renderEstrellas(instructor.calificacionPromedio)}
                </div>
                <span className="text-lg font-bold text-yellow-400">
                  ({instructor.calificacionPromedio} de 5)
                </span>
                <span className="text-sm text-gray-400">
                  • {instructor.totalCalificaciones} {instructor.totalCalificaciones === 1 ? 'reseña' : 'reseñas'}
                </span>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-blue-400 text-lg">📧</span>
                <p className="text-gray-300">
                  {instructor.correo}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-600">
          <div className="flex">
            <button
              onClick={() => setActiveTab('perfil')}
              className={`px-6 py-3 font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'perfil'
                  ? 'border-b-2 border-sena-green text-sena-green bg-gray-800/50'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
              }`}
            >
              <span>👤</span>
              Perfil
            </button>
            <button
              onClick={() => setActiveTab('calificaciones')}
              className={`px-6 py-3 font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'calificaciones'
                  ? 'border-b-2 border-sena-green text-sena-green bg-gray-800/50'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
              }`}
            >
              <span>⭐</span>
              Calificaciones ({instructor.totalCalificaciones})
            </button>
          </div>
        </div>

        {/* Contenido de las tabs */}
        <div className="p-6">
          {activeTab === 'perfil' && (
            <div className="space-y-6">
              {/* Experiencia */}
              {instructor.experiencia && (
                <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl border border-gray-600 shadow-sm">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-blue-400">📚</span>
                    Experiencia
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-base">
                    {instructor.experiencia}
                  </p>
                </div>
              )}

              {/* Cursos */}
              {instructor.cursos && instructor.cursos.length > 0 && (
                <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl border border-gray-600 shadow-sm">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-sena-green">🎓</span>
                    Cursos que enseña
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {instructor.cursos.map((curso, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-sena-green to-sena-green-dark text-white rounded-full text-sm font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
                      >
                        {curso}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Biografía */}
              {instructor.biografia && (
                <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl border border-gray-600 shadow-sm">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-purple-400">👨‍🏫</span>
                    Acerca de mí
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-base">
                    {instructor.biografia}
                  </p>
                </div>
              )}

              {/* Información adicional */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl border border-gray-600 shadow-sm">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-yellow-400">📋</span>
                  Información adicional
                </h3>
                <div className="grid md:grid-cols-2 gap-6 text-base">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 font-medium">Rol:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      instructor.rol === 'instructor' 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                      {instructor.rol === 'instructor' ? '👨‍🏫 Instructor' : '👔 Funcionario'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 font-medium">Miembro desde:</span>
                    <span className="text-sena-green font-semibold">
                      {formatearFecha(instructor.fechaRegistro)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calificaciones' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-yellow-400">⭐</span>
                Calificaciones de los estudiantes
              </h3>
              
              {loadingCalificaciones ? (
                <div className="text-center py-12 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-gray-600">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-sena-green mx-auto mb-4"></div>
                  <p className="text-gray-300 text-lg">Cargando calificaciones...</p>
                </div>
              ) : calificaciones.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-gray-600">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-400 text-lg">
                    Este {instructor.rol} aún no tiene calificaciones.
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    ¡Sé el primero en calificar!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {calificaciones.map((calificacion, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-700 p-5 rounded-xl border border-gray-600 shadow-sm hover:shadow-lg transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex">
                              {renderEstrellas(calificacion.Calificacion)}
                            </div>
                            <span className="font-bold text-yellow-400 text-lg">
                              ({calificacion.Calificacion}/5)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-400">👨‍🎓</span>
                            <p className="text-sm text-gray-300 font-medium">
                              {calificacion.EstudianteNombre} {calificacion.EstudianteApellido}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 text-xs">📅</span>
                          <span className="text-xs text-gray-400">
                            {formatearFecha(calificacion.FechaCalificacion)}
                          </span>
                        </div>
                      </div>
                      {calificacion.Comentario && (
                        <div className="mt-3 p-3 bg-gray-700/50 rounded-lg border-l-4 border-sena-green">
                          <p className="text-gray-300 text-sm italic leading-relaxed">
                            💬 "{calificacion.Comentario}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4 flex justify-end border-t border-gray-600">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded-lg hover:from-gray-500 hover:to-gray-400 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          >
            <span>❌</span>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorModal; 