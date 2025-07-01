import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getInstructoresYFuncionarios } from '../../services/instructorService';
import { getCurrentUser } from '../../services/auth';
import InstructorModal from '../../components/InstructorModal';
import CalificacionModal from '../../components/CalificacionModal';
import EditarPerfilModal from '../../components/EditarPerfilModal';

const InstrucFuncionarios = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [instructores, setInstructores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCalificacionModal, setShowCalificacionModal] = useState(false);
  const [showEditarPerfilModal, setShowEditarPerfilModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const sectionRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);
  const ANIMATION_INTERVAL = 6000;

  // Cargar usuario actual
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Cargar instructores desde la API
  useEffect(() => {
    const cargarInstructores = async () => {
      try {
        setLoading(true);
        const data = await getInstructoresYFuncionarios();
        console.log('📚 Instructores cargados:', data);
        setInstructores(data);
        setError(null);
      } catch (error) {
        console.error('❌ Error al cargar instructores:', error);
        setError('Error al cargar instructores. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    cargarInstructores();
  }, []);

  // Manejar redimensionado de ventana
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) {
      setCardsToShow(1);
    } else if (width < 1024) {
      setCardsToShow(2);
    } else {
      setCardsToShow(3);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Animación automática del slider
  const updateSlide = useCallback(() => {
    if (instructores.length === 0) return;
    
    const currentTime = performance.now();
    if (currentTime - lastUpdateTimeRef.current >= ANIMATION_INTERVAL) {
      setCurrentIndex((prevIndex) => 
        prevIndex >= instructores.length - cardsToShow ? 0 : prevIndex + 1
      );
      lastUpdateTimeRef.current = currentTime;
    }
    animationFrameRef.current = requestAnimationFrame(updateSlide);
  }, [cardsToShow, instructores.length]);

  useEffect(() => {
    if (instructores.length > 0) {
      animationFrameRef.current = requestAnimationFrame(updateSlide);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateSlide]);

  // Renderizar estrellas de calificación
  const renderEstrellas = useCallback((calificacion) => {
    const rating = parseFloat(calificacion) || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        className={`text-base md:text-lg transition-colors duration-300 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 
          i < rating ? 'text-yellow-300' : 'text-gray-400'
        }`}
      >
        ★
      </span>
    ));
  }, []);

  // Obtener imagen por defecto o la foto del instructor
  const getImagenInstructor = (instructor) => {
    if (instructor.foto) {
      // Si la URL ya es completa, úsala tal cual
      if (instructor.foto.startsWith('http')) {
        return instructor.foto;
      }
      // Si es una ruta local, anteponer el dominio
      return `http://localhost:5000${instructor.foto}`;
    }
    // Imagen por defecto basada en el género sugerido por el nombre
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.nombre + ' ' + instructor.apellido)}&background=4ade80&color=ffffff&size=400`;
  };

  // Verificar si el usuario actual puede editar el perfil
  const puedeEditarPerfil = (instructor) => {
    return currentUser && 
           currentUser.id === instructor.id && 
           ['instructor', 'funcionario'].includes(currentUser.rol);
  };

  // Abrir modal de calificación
  const handleCalificar = () => {
    setShowCalificacionModal(true);
  };

  // Abrir modal de editar perfil
  const handleEditarPerfil = (instructor) => {
    setSelectedInstructor(instructor);
    setShowEditarPerfilModal(true);
  };

  // Recargar instructores después de actualizar perfil
  const handlePerfilActualizado = async () => {
    try {
      const data = await getInstructoresYFuncionarios();
      setInstructores(data);
      setShowEditarPerfilModal(false);
    } catch (error) {
      console.error('Error al recargar instructores:', error);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-[#1a1f2e] font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando instructores...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-[#1a1f2e] font-poppins flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Intentar nuevamente
          </button>
        </div>
      </section>
    );
  }

  if (instructores.length === 0) {
    return (
      <section className="min-h-screen bg-[#1a1f2e] font-poppins flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">No hay instructores disponibles en este momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen bg-[#1a1f2e] font-poppins overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold text-white text-center mb-8">
          Nuestros Instructores y Funcionarios
        </h2>
        
        <div className="relative">
          <div className="flex flex-nowrap gap-4 md:gap-6 transition-transform duration-500 ease-in-out">
            {instructores.slice(currentIndex, currentIndex + cardsToShow).map((instructor) => (
              <div 
                key={instructor.id} 
                className={`flex-none ${
                  cardsToShow === 1 ? 'w-[85%] mx-auto' : 
                  cardsToShow === 2 ? 'w-[calc(50%-12px)]' : 
                  'w-[calc(33.333%-16px)]'
                }`}
              >
                <div className="bg-[#242937] rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img 
                      src={getImagenInstructor(instructor)} 
                      alt={`${instructor.nombre} ${instructor.apellido}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.nombre + ' ' + instructor.apellido)}&background=4ade80&color=ffffff&size=400`;
                      }}
                    />
                    {/* Badge de rol */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        instructor.rol === 'instructor' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-purple-500 text-white'
                      }`}>
                        {instructor.rol === 'instructor' ? 'Instructor' : 'Funcionario'}
                      </span>
                    </div>
                    {/* Botón de editar perfil (solo para el propio usuario) */}
                    {puedeEditarPerfil(instructor) && (
                      <button
                        onClick={() => handleEditarPerfil(instructor)}
                        className="absolute top-2 left-2 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all duration-300"
                        title="Editar mi perfil"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg md:text-xl font-semibold text-white text-center mb-1">
                      {instructor.nombre} {instructor.apellido}
                    </h3>
                    <p className="text-gray-400 text-sm text-center mb-2">
                      {instructor.especialidad || 'Especialidad no especificada'}
                    </p>
                    
                    {/* Calificación */}
                    <div className="flex justify-center items-center gap-2 mb-3">
                      <div className="flex gap-1">
                        {renderEstrellas(instructor.calificacionPromedio)}
                      </div>
                      <span className="text-white text-sm">
                        ({instructor.calificacionPromedio}) 
                        <span className="text-gray-400 text-xs ml-1">
                          ({instructor.totalCalificaciones} {instructor.totalCalificaciones === 1 ? 'reseña' : 'reseñas'})
                        </span>
                      </span>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-2">
                      <button 
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors duration-300 text-sm md:text-base"
                        onClick={() => setSelectedInstructor(instructor)}
                      >
                        Ver más
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicadores de navegación */}
          {instructores.length > cardsToShow && (
            <div className="flex justify-center mt-6 gap-1.5">
              {Array.from({ length: Math.ceil(instructores.length / cardsToShow) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i * cardsToShow)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === Math.floor(currentIndex / cardsToShow)
                      ? 'bg-green-500 w-4'
                      : 'bg-gray-500 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir a slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sección de calificación */}
        <div className="mt-12 bg-gradient-to-br from-[#242937] to-[#1a1f2e] rounded-2xl p-8 text-center border border-gray-700 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-sena-green to-sena-green-dark rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">⭐</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              Califica a Tus Instructores
            </h3>
          </div>
          
                      <div className="max-w-2xl mx-auto mb-6">
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                Tu opinión es <span className="text-sena-green font-semibold">muy importante</span> para nosotros. 
                Nos ayuda a mejorar constantemente la calidad de nuestra enseñanza.
              </p>
            <p className="text-gray-400 text-sm md:text-base mt-2">
              {currentUser && currentUser.rol === 'aprendiz' 
                ? '🎓 Como aprendiz registrado, puedes calificar directamente.' 
                : '📋 Si eres aprendiz, inicia sesión o proporciona tu número de documento para calificar.'
              }
            </p>
          </div>
          
          <button 
            onClick={handleCalificar}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-sena-green-dark to-sena-green hover:from-sena-green hover:to-sena-green-dark text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl font-bold text-lg shadow-lg sena-green-glow"
          >
            <span className="text-2xl">⭐</span>
            <span>Calificar Instructor</span>
            <span className="text-xl">→</span>
          </button>
          
                     <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-gray-400">
             <div className="flex items-center gap-1">
               <span className="text-yellow-400">★★★★★</span>
               <span>Calificación 1-5</span>
             </div>
             <div className="hidden sm:block w-1 h-1 bg-gray-500 rounded-full"></div>
             <div className="flex items-center gap-1">
               <span className="text-blue-400">💬</span>
               <span>Comentarios opcionales</span>
             </div>
             <div className="hidden sm:block w-1 h-1 bg-gray-500 rounded-full"></div>
             <div className="flex items-center gap-1">
               <span className="text-green-400">🔒</span>
               <span>Privacidad garantizada</span>
             </div>
           </div>
        </div>
      </div>

      {/* Modales */}
      {selectedInstructor && !showEditarPerfilModal && (
        <InstructorModal
          instructor={selectedInstructor}
          onClose={() => setSelectedInstructor(null)}
        />
      )}

      {showCalificacionModal && (
        <CalificacionModal
          instructores={instructores}
          currentUser={currentUser}
          onClose={() => setShowCalificacionModal(false)}
        />
      )}

      {showEditarPerfilModal && selectedInstructor && (
        <EditarPerfilModal
          instructor={selectedInstructor}
          onClose={() => setShowEditarPerfilModal(false)}
          onPerfilActualizado={handlePerfilActualizado}
        />
      )}
    </section>
  );
};

export default InstrucFuncionarios;
