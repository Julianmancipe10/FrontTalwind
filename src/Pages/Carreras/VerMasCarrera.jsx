import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../Layouts/Header/Header';
import { getPublicacionById, updatePublicacion } from '../../services/publicaciones';
import PermissionWrapper from "../../components/PermissionWrapper/PermissionWrapper";
import { PERMISOS } from "../../constants/roles";
import { buildApiUrl, getImageUrl } from '../../services/config';
import defaultCarrera from '../../assets/images/optimized/optimized_slider1.jpg';

const VerMasCarrera = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [carrera, setCarrera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchCarrera = async () => {
      try {
        setLoading(true);
        const data = await getPublicacionById(id);
        
        if (data) {
          // Extraer información de la descripción extendida
          const descripcionCompleta = data.Descripción || '';
          const descripcionLineas = descripcionCompleta.split('\n');
          const descripcionBase = descripcionLineas[0] || 'Sin descripción disponible';
          
          // Buscar duración y título en la descripción
          const duracionMatch = descripcionCompleta.match(/Duración:\s*(\d+)\s*horas/);
          const tituloMatch = descripcionCompleta.match(/Título a obtener:\s*(.+?)(?:\n|$)/);
          
          const carreraData = {
            id: data.ID_Evento,
            titulo: data.Nombre,
            descripcion: descripcionBase,
            descripcionCompleta: descripcionCompleta,
            horas: duracionMatch ? duracionMatch[1] : 'No especificado',
            tituloObtener: tituloMatch ? tituloMatch[1] : 'No especificado',
            ubicacion: data.Ubicacion,
            fecha: data.Fecha,
            enlace: data.URL_Enlace,
            tipo: data.TipoPublicacion === '3' ? 'Técnico' : 'Tecnólogo',
            creador: `${data.CreadorNombre || ''} ${data.CreadorApellido || ''}`.trim(),
            fechaCreacion: data.FechaCreacion,
            imagen: data.ImagenSlider ? getImageUrl(data.ImagenSlider) : defaultCarrera
          };
          
          setCarrera(carreraData);
          setEditForm({
            titulo: carreraData.titulo,
            descripcion: carreraData.descripcion,
            horas: carreraData.horas,
            tituloObtener: carreraData.tituloObtener,
            ubicacion: carreraData.ubicacion,
            enlace: carreraData.enlace || ''
          });
        } else {
          setError('Carrera no encontrada');
        }
      } catch (error) {
        console.error('Error al cargar carrera:', error);
        setError('Error al cargar la carrera');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCarrera();
    }

    // Exponer fetchCarrera para usarlo después de editar
    VerMasCarrera.fetchCarrera = fetchCarrera;
  }, [id]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      // Log para depuración: mostrar el objeto editForm
      console.log('Valores a enviar:', editForm);
      // Crear descripción completa actualizada
      const descripcionCompleta = `${editForm.descripcion}\n\nDuración: ${editForm.horas} horas\nTítulo a obtener: ${editForm.tituloObtener}`;
      
      const updateData = {
        Nombre: editForm.titulo,
        Descripcion: descripcionCompleta,
        Ubicacion: editForm.ubicacion,
        URL_Enlace: editForm.enlace
      };
      // Log para depuración: mostrar el objeto updateData
      console.log('Objeto updateData a enviar:', updateData);

      await updatePublicacion(id, updateData);

      // Volver a pedir los datos actualizados del backend
      await VerMasCarrera.fetchCarrera();
      setIsEditing(false);
      alert('Carrera actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar carrera:', error);
      alert(`Error al actualizar la carrera: ${error.message}`);
    }
  };

  const getCardColor = (tipo) => {
    return 'bg-[#39B54A]';
  };

  const getCardGradient = (tipo) => {
    return 'bg-gradient-to-r from-[#39B54A] to-[#2d8f3a]';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="flex justify-center items-center pt-32">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#39B54A]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8 pt-32">
          <div className="bg-red-600/20 text-red-200 p-6 rounded-lg border border-red-600 text-center">
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p>{error}</p>
            <button
              onClick={() => navigate('/carreras-tecnologicas')}
              className="mt-4 bg-[#39B54A] hover:bg-[#2d8f3a] text-white px-4 py-2 rounded-lg transition-colors"
            >
              Volver a Carreras
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!carrera) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-32">
        
        {/* Botón de regresar */}
        <button
          onClick={() => navigate('/carreras-tecnologicas')}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Atrás
        </button>

        {/* Header de la carrera */}
        <div className={`${getCardGradient(carrera.tipo)} rounded-t-xl p-8 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Carrera {carrera.tipo}
                  </span>
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                    {carrera.horas} horas
                  </span>
                </div>
                
                {isEditing ? (
                  <input
                    type="text"
                    name="titulo"
                    value={editForm.titulo}
                    onChange={handleEditChange}
                    className="text-4xl font-bold bg-white/20 text-white placeholder-gray-200 border-2 border-white/30 rounded-lg px-4 py-2 w-full mb-4"
                    placeholder="Título de la carrera"
                  />
                ) : (
                  <h1 className="text-4xl font-bold mb-4">{carrera.titulo}</h1>
                )}
                
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{carrera.ubicacion}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Visible hasta: {new Date(carrera.fecha).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <PermissionWrapper requiredPermissions={[PERMISOS.EDITAR_PUBLICACION]}>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="bg-[#39B54A] hover:bg-[#2d8f3a] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Guardar
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                  )}
                </div>
              </PermissionWrapper>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="bg-gray-800 rounded-b-xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Información principal */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#39B54A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descripción del Programa
                </h2>
                
                {isEditing ? (
                  <textarea
                    name="descripcion"
                    value={editForm.descripcion}
                    onChange={handleEditChange}
                    rows="5"
                    className="w-full bg-gray-700 text-white border-2 border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-[#39B54A]"
                    placeholder="Descripción de la carrera"
                  />
                ) : (
                  <p className="text-gray-300 leading-relaxed">{carrera.descripcion}</p>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#39B54A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Título a Obtener
                </h3>
                
                {isEditing ? (
                  <input
                    type="text"
                    name="tituloObtener"
                    value={editForm.tituloObtener}
                    onChange={handleEditChange}
                    className="w-full bg-gray-700 text-white border-2 border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-[#39B54A]"
                    placeholder="Título que se obtiene"
                  />
                ) : (
                  <p className="text-[#39B54A] font-semibold text-lg">{carrera.tituloObtener}</p>
                )}
              </div>

              {carrera.enlace && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#39B54A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Enlace Relacionado
                  </h3>
                  
                  {isEditing ? (
                    <input
                      type="url"
                      name="enlace"
                      value={editForm.enlace}
                      onChange={handleEditChange}
                      className="w-full bg-gray-700 text-white border-2 border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-[#39B54A]"
                      placeholder="https://ejemplo.com"
                    />
                  ) : (
                    <a
                      href={carrera.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#39B54A] hover:text-[#2d8f3a] transition-colors underline"
                    >
                      {carrera.enlace}
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#39B54A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Información General
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-600">
                    <span className="text-gray-300">Tipo de Programa:</span>
                    <span className="text-white font-semibold">Carrera {carrera.tipo}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-600">
                    <span className="text-gray-300">Duración:</span>
                    <span className="text-white font-semibold">{carrera.horas} horas</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-600">
                    <span className="text-gray-300">Modalidad:</span>
                    <span className="text-white font-semibold">Presencial</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-600">
                    <span className="text-gray-300">Ubicación:</span>
                    <span className="text-white font-semibold text-right flex-1 ml-4">
                      {isEditing ? (
                        <input
                          type="text"
                          name="ubicacion"
                          value={editForm.ubicacion}
                          onChange={handleEditChange}
                          className="w-full bg-gray-600 text-white border border-gray-500 rounded px-2 py-1 text-sm"
                          placeholder="Ubicación"
                        />
                      ) : (
                        carrera.ubicacion
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-600">
                    <span className="text-gray-300">Visible hasta:</span>
                    <span className="text-white font-semibold">
                      {new Date(carrera.fecha).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información del creador */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#39B54A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Información de Creación
                </h3>
                
                <div className="space-y-3">
                  {carrera.creador && (
                    <div>
                      <span className="text-gray-300">Creado por: </span>
                      <span className="text-white font-semibold">{carrera.creador}</span>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-gray-300">Fecha de creación: </span>
                    <span className="text-white font-semibold">
                      {new Date(carrera.fechaCreacion).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón de acción */}
              <div className="flex justify-center">
                <button
                  onClick={() => window.open('https://senasofiaplus.edu.co', '_blank')}
                  className="bg-[#39B54A] hover:bg-[#2d8f3a] text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center gap-3 shadow-lg shadow-[#39B54A]/20"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Inscríbete Ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerMasCarrera; 