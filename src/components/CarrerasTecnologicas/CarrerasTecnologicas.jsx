import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Header } from "../../Layouts/Header/Header";
import PermissionWrapper from "../PermissionWrapper/PermissionWrapper";
import { PERMISOS } from "../../constants/roles";
import { getCarreras } from "../../services/publicaciones";
import { getImageUrl } from '../../services/config';

// Imagen por defecto para carreras
import defaultCarrera from "../../assets/images/optimized/optimized_slider1.jpg";

const CarrerasTecnologicas = () => {
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        setLoading(true);
        const carrerasData = await getCarreras();
        
                 if (carrerasData) {
           // Solo mostrar tecnólogos en esta vista
           const tecnologos = carrerasData.tecnologos || [];
           
           // Formatear datos para mostrar
           const carrerasFormateadas = tecnologos.map(carrera => {
            // Extraer información de la descripción extendida
            const descripcionCompleta = carrera.Descripción || '';
            const descripcionLineas = descripcionCompleta.split('\n');
            const descripcionBase = descripcionLineas[0] || 'Sin descripción disponible';
            
            // Buscar duración y título en la descripción
            const duracionMatch = descripcionCompleta.match(/Duración:\s*(\d+)\s*horas/);
            const tituloMatch = descripcionCompleta.match(/Título a obtener:\s*(.+?)(?:\n|$)/);
            
            return {
              id: carrera.ID_Evento,
              titulo: carrera.Nombre,
              descripcion: descripcionBase,
              horas: duracionMatch ? duracionMatch[1] : 'No especificado',
              tituloObtener: tituloMatch ? tituloMatch[1] : 'No especificado',
              ubicacion: carrera.Ubicacion,
              fecha: carrera.Fecha,
              tipo: carrera.TipoPublicacion === '3' ? 'Técnico' : 'Tecnólogo',
              creador: `${carrera.CreadorNombre || ''} ${carrera.CreadorApellido || ''}`.trim(),
              fechaCreacion: carrera.FechaCreacion,
              imagen: carrera.Imagen
            };
          });
          
          setCarreras(carrerasFormateadas);
        } else {
          setCarreras([]);
        }
      } catch (error) {
        console.error('Error al cargar carreras:', error);
        setError('Error al cargar las carreras. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarreras();
  }, []);

  const getCardColor = (tipo) => {
    return tipo === 'Técnico' ? 'bg-[#39B54A]' : 'bg-[#39B54A]';
  };

  const getCardAccent = (tipo) => {
    return tipo === 'Técnico' ? 'border-[#39B54A]' : 'border-[#39B54A]';
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

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-32">
        
        {/* Header con botón de crear */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Atrás
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">Carreras Tecnológicas</h1>
            <p className="text-gray-300">Explora nuestros programas tecnológicos y especialízate en el área que más te guste</p>
          </div>
          
          <PermissionWrapper requiredPermissions={[PERMISOS.CREAR_CARRERA]}>
            <Link
              to="/crear-carrera"
              className="bg-[#39B54A] hover:bg-[#2d8f3a] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2 shadow-lg shadow-[#39B54A]/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Crear Nueva Carrera
            </Link>
          </PermissionWrapper>
        </div>

        {error && (
          <div className="bg-red-600/20 text-red-200 p-4 rounded-lg mb-6 border border-red-600">
            {error}
          </div>
        )}

        {carreras.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-xl font-semibold text-white mb-2">No hay carreras tecnológicas disponibles</h3>
                <p className="text-gray-400 mb-6">Sé el primero en crear una carrera tecnológica para la comunidad</p>
                <PermissionWrapper requiredPermissions={[PERMISOS.CREAR_CARRERA]}>
                  <Link
                    to="/crear-carrera"
                    className="bg-[#39B54A] hover:bg-[#2d8f3a] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 inline-flex items-center gap-2 shadow-lg shadow-[#39B54A]/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Crear Primera Carrera
                  </Link>
                </PermissionWrapper>
              </div>
            </div>
          </div>
        )}

        {/* Grid de carreras */}
        {carreras.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carreras.map((carrera) => (
              <div
                key={carrera.id}
                className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-[#39B54A]/20 transition-all duration-300 hover:scale-105 border border-gray-700 hover:border-[#39B54A]/50"
              >
                {/* Header de la tarjeta */}
                <div className={`${getCardColor(carrera.tipo)} p-4`}>
                  <h3 className="text-xl font-bold text-white mb-1">{carrera.titulo}</h3>
                  <p className="text-gray-100 text-sm">Carrera {carrera.tipo}</p>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-6">
                  {/* Imagen de la carrera (si existiera campo de imagen) */}
                  {carrera.imagen && (
                    <div className="flex justify-center mb-4">
                      <img
                        src={getImageUrl(carrera.imagen)}
                        alt={carrera.titulo}
                        className="w-32 h-32 object-cover rounded-lg border-2 border-green-200 shadow"
                      />
                    </div>
                  )}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 mr-2 text-[#39B54A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">
                        <strong className="text-[#39B54A]">DURACIÓN:</strong>
                      </span>
                    </div>
                    <p className="text-white font-semibold">{carrera.horas} horas</p>

                    <div className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 mr-2 text-[#39B54A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm">
                        <strong className="text-[#39B54A]">DESCRIPCIÓN:</strong>
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-3">{carrera.descripcion}</p>

                    <div className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 mr-2 text-[#39B54A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span className="text-sm">
                        <strong className="text-[#39B54A]">TÍTULO A OBTENER:</strong>
                      </span>
                    </div>
                    <p className="text-white font-semibold text-sm">{carrera.tituloObtener}</p>
                  </div>

                  {/* Información adicional */}
                  <div className="space-y-2 mb-6">
                    <p className="text-gray-400 text-xs">
                      <span className="text-gray-300">Visible hasta:</span> {new Date(carrera.fecha).toLocaleDateString('es-ES')}
                    </p>
                    {carrera.creador && (
                      <p className="text-gray-400 text-xs">
                        <span className="text-gray-300">Creado por:</span> {carrera.creador}
                      </p>
                    )}
                  </div>

                  {/* Botón Ver Más */}
                  <Link
                    to={`/carrera/${carrera.id}`}
                    className="w-full bg-[#39B54A] hover:bg-[#2d8f3a] text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#39B54A]/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver Más
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarrerasTecnologicas;
