import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../Layouts/Header/Header';
import { Footer } from '../../Layouts/Footer/Footer';
import PermissionWrapper from "../../components/PermissionWrapper/PermissionWrapper";
import { PERMISOS } from "../../constants/roles";
import { getCarreras } from "../../services/publicaciones";

const CarrerasTecnologicas = () => {
  const [carreras, setCarreras] = useState({ cursos: [], tecnologos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('todos'); // 'todos', 'cursos', 'tecnologos'

  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        setLoading(true);
        const carrerasData = await getCarreras();
        
        if (carrerasData) {
          setCarreras({
            cursos: carrerasData.cursos || [],
            tecnologos: carrerasData.tecnologos || []
          });
        }
      } catch (error) {
        console.error('Error al cargar carreras:', error);
        setError('Error al cargar carreras');
      } finally {
        setLoading(false);
      }
    };

    fetchCarreras();
  }, []);

  // Combinar y filtrar carreras
  const todasLasCarreras = [...carreras.cursos, ...carreras.tecnologos];
  
  const carrerasFiltradas = todasLasCarreras.filter(carrera => {
    const matchSearch = carrera.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       carrera.Descripción?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedType === 'todos') return matchSearch;
    if (selectedType === 'cursos') return matchSearch && carrera.TipoPublicacion === '3';
    if (selectedType === 'tecnologos') return matchSearch && carrera.TipoPublicacion === '4';
    
    return matchSearch;
  });

  const getCarreraType = (tipoPublicacion) => {
    return tipoPublicacion === '3' ? 'Curso Técnico' : 'Tecnólogo';
  };

  const getCarreraColor = (tipoPublicacion) => {
    return tipoPublicacion === '3' ? 'bg-accent-teal' : 'bg-accent-green';
  };

  const parseCarreraInfo = (descripcion) => {
    const duracionMatch = descripcion?.match(/Duración:\s*(.+)/);
    const tituloMatch = descripcion?.match(/Título a obtener:\s*(.+)/);
    
    return {
      duracion: duracionMatch ? duracionMatch[1].split('\n')[0] : 'No especificado',
      titulo: tituloMatch ? tituloMatch[1] : 'No especificado',
      descripcionBase: descripcion?.split('Duración:')[0]?.trim() || descripcion || ''
    };
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#BFFF71] mx-auto mb-4"></div>
            <p className="text-xl">Cargando carreras...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-[#BFFF71] mb-4">
              Carreras Tecnológicas
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Descubre nuestras ofertas educativas en programas técnicos y tecnólogos.
              Forma parte del futuro con educación de calidad.
            </p>
          </div>

          {/* Botón Crear Carrera */}
          <div className="mb-8 flex justify-center">
            <PermissionWrapper requiredPermissions={[PERMISOS.CREAR_CARRERA]}>
              <Link
                to="/crear-carrera"
                className="bg-[#BFFF71] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#a6e85c] transition-colors duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Crear Nueva Carrera
              </Link>
            </PermissionWrapper>
          </div>

          {error && (
            <div className="bg-red-600/20 text-red-200 p-4 rounded-lg mb-8 border border-red-600 text-center">
              {error}
            </div>
          )}

          {/* Filtros */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Búsqueda */}
            <div className="w-full md:w-1/2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar carreras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#BFFF71] focus:ring-1 focus:ring-[#BFFF71] transition-all"
                />
                <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filtro por tipo */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              {[
                { key: 'todos', label: 'Todos' },
                { key: 'cursos', label: 'Cursos Técnicos' },
                { key: 'tecnologos', label: 'Tecnólogos' }
              ].map((tipo) => (
                <button
                  key={tipo.key}
                  onClick={() => setSelectedType(tipo.key)}
                  className={`px-4 py-2 rounded-md font-medium transition-all ${
                    selectedType === tipo.key
                      ? 'bg-[#BFFF71] text-black'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {tipo.label}
                </button>
              ))}
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold text-[#BFFF71]">{carreras.cursos.length}</h3>
              <p className="text-gray-300">Cursos Técnicos</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold text-[#BFFF71]">{carreras.tecnologos.length}</h3>
              <p className="text-gray-300">Tecnólogos</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold text-[#BFFF71]">{todasLasCarreras.length}</h3>
              <p className="text-gray-300">Total Programas</p>
            </div>
          </div>

          {/* Lista de Carreras */}
          {carrerasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-400 mb-2">
                {todasLasCarreras.length === 0 ? 'No hay carreras disponibles' : 'No se encontraron carreras'}
              </h3>
              <p className="text-gray-500">
                {todasLasCarreras.length === 0 
                  ? 'Sé el primero en crear una carrera'
                  : 'Intenta con otros términos de búsqueda'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {carrerasFiltradas.map((carrera) => {
                const info = parseCarreraInfo(carrera.Descripción);
                return (
                  <div
                    key={carrera.ID_Evento}
                    className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl hover:shadow-[#BFFF71]/20 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="p-6">
                      {/* Tipo de carrera */}
                      <span className={`inline-block px-3 py-1 ${getCarreraColor(carrera.TipoPublicacion)} text-white text-sm font-semibold rounded-full mb-4`}>
                        {getCarreraType(carrera.TipoPublicacion)}
                      </span>
                      
                      {/* Título */}
                      <h3 className="text-xl font-bold text-[#BFFF71] mb-3 min-h-[3rem] line-clamp-2">
                        {carrera.Nombre}
                      </h3>
                      
                      {/* Descripción */}
                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {info.descripcionBase}
                      </p>
                      
                      {/* Información adicional */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {info.duracion}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          {info.titulo}
                        </div>
                      </div>
                      
                      {/* Botón de acción */}
                      <Link 
                        to={`/carrera/${carrera.ID_Evento}`}
                        className="block w-full bg-[#BFFF71] text-black py-2 px-4 rounded-lg font-medium hover:bg-[#a6e85c] transition-colors duration-300 text-center"
                      >
                        Más Información
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default CarrerasTecnologicas; 