import React, { useState, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';
import { Header } from "../../Layouts/Header/Header";
import PermissionWrapper from "../../components/PermissionWrapper/PermissionWrapper";
import { PERMISOS } from "../../constants/roles";
import { getEventos, getNoticias } from "../../services/publicaciones";
import { getImageUrl } from '../../services/config';

// Fallback para imágenes por defecto
import slider1 from "../../assets/images/optimized/optimized_slider1.jpg";
import slider2 from "../../assets/images/optimized/optimized_slider2.jpg";
import slider3 from "../../assets/images/optimized/optimized_slider3.jpg";

const EventosNoticias = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [newContentAvailable, setNewContentAvailable] = useState(false);

  const fetchPublicaciones = useCallback(async (resetData = false, isManualRefresh = false) => {
    try {
      if (resetData) {
        if (isManualRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setPage(1);
      } else {
        setLoadingMore(true);
      }

      const [eventosData, noticiasData] = await Promise.all([
        getEventos(),
        getNoticias()
      ]);

      const eventosFormateados = (eventosData || []).map(evento => ({
        id: `evento-${evento.ID_Evento}`,
        tipo: 'evento',
        titulo: evento.Nombre,
        descripcion: evento.Descripción,
        imagen: evento.ImagenSlider ? getImageUrl(evento.ImagenSlider) : slider1,
        fecha: evento.Fecha,
        ubicacion: evento.Ubicacion,
        creador: `${evento.CreadorNombre || ''} ${evento.CreadorApellido || ''}`.trim(),
        fechaCreacion: new Date(evento.FechaCreacion || evento.Fecha)
      }));

      const noticiasFormateadas = (noticiasData || []).map(noticia => ({
        id: `noticia-${noticia.ID_Evento}`,
        tipo: 'noticia',
        titulo: noticia.Nombre,
        descripcion: noticia.Descripción,
        imagen: noticia.ImagenSlider ? `http://localhost:5000${noticia.ImagenSlider}` : slider2,
        fecha: noticia.Fecha,
        ubicacion: noticia.Ubicacion,
        creador: `${noticia.CreadorNombre || ''} ${noticia.CreadorApellido || ''}`.trim(),
        fechaCreacion: new Date(noticia.FechaCreacion || noticia.Fecha)
      }));

      // Combinar y ordenar por fecha de creación más reciente
      const todasPublicaciones = [...eventosFormateados, ...noticiasFormateadas]
        .sort((a, b) => b.fechaCreacion - a.fechaCreacion);

      if (resetData) {
        // Detectar si hay nuevo contenido (solo si no es la carga inicial)
        if (publicaciones.length > 0 && todasPublicaciones.length > publicaciones.length) {
          setNewContentAvailable(true);
          setTimeout(() => setNewContentAvailable(false), 5000); // Ocultar después de 5 segundos
        }
        setPublicaciones(todasPublicaciones);
      } else {
        setPublicaciones(prev => [...prev, ...todasPublicaciones]);
      }

      // Simular paginación (en el futuro se puede implementar en el backend)
      setHasMore(false);
      setLastUpdateTime(new Date());
      
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
      setError('Error al cargar el contenido');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicaciones(true);

    // Actualización automática cada 30 segundos
    const interval = setInterval(() => {
      fetchPublicaciones(true);
    }, 30000);

    // Actualizar cuando el usuario vuelve a la pestaña
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchPublicaciones(true);
      }
    };

    // Actualizar cuando la ventana recibe foco
    const handleFocus = () => {
      fetchPublicaciones(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchPublicaciones]);

  const publicacionesFiltradas = publicaciones.filter(pub => {
    if (filtroActivo === 'todos') return true;
    if (filtroActivo === 'eventos') return pub.tipo === 'evento';
    if (filtroActivo === 'noticias') return pub.tipo === 'noticia';
    return true;
  });

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const TabButton = ({ active, onClick, children, count }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
        active
          ? 'bg-[#39B54A] text-white shadow-lg shadow-[#39B54A]/30'
          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
      }`}
    >
      {children}
      {count > 0 && (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          active ? 'bg-white text-[#39B54A]' : 'bg-gray-600 text-white'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header con título y botones de acción */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#BFFF71] to-[#39B54A] bg-clip-text text-transparent">
                  Eventos y Noticias
                </h1>
                <div className="flex items-center gap-1 px-2 py-1 bg-[#39B54A]/20 text-[#BFFF71] rounded-full text-xs font-medium">
                  <div className="w-2 h-2 bg-[#39B54A] rounded-full animate-pulse"></div>
                  En vivo
                </div>
              </div>
              <p className="text-gray-400 mt-2 text-lg">
                Mantente al día con las últimas novedades de nuestra comunidad • Actualización automática cada 30s
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <PermissionWrapper requiredPermissions={[PERMISOS.CREAR_EVENTO]}>
                <Link
                  to="/crear-evento"
                  className="bg-[#BFFF71] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#a6e85c] transition-colors duration-300 flex items-center gap-2 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Crear Evento
                </Link>
              </PermissionWrapper>
              
              <PermissionWrapper requiredPermissions={[PERMISOS.CREAR_NOTICIA]}>
                <Link
                  to="/crear-noticia"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  Crear Noticia
                </Link>
              </PermissionWrapper>
            </div>
          </div>

          {/* Barra de estado y refrescar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 p-4 bg-gray-800/20 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                Última actualización: {lastUpdateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </span>
              {refreshing && (
                <div className="flex items-center gap-2 text-[#BFFF71]">
                  <div className="w-3 h-3 border border-[#BFFF71]/30 border-t-[#BFFF71] rounded-full animate-spin"></div>
                  <span className="text-xs">Actualizando...</span>
                </div>
              )}
            </div>
            
            <button
              onClick={() => fetchPublicaciones(true, true)}
              disabled={refreshing || loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg 
                className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? 'Actualizando...' : 'Refrescar'}
            </button>
          </div>

          {/* Notificación de nuevo contenido */}
          {newContentAvailable && (
            <div className="mb-6 p-4 bg-[#39B54A]/20 border border-[#39B54A] text-[#BFFF71] rounded-lg backdrop-blur-sm animate-pulse">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">¡Nueva publicación disponible!</span>
              </div>
            </div>
          )}

          {/* Pestañas de filtrado */}
          <div className="flex flex-wrap gap-4 mb-8 p-4 bg-gray-800/30 rounded-xl backdrop-blur-sm">
            <TabButton
              active={filtroActivo === 'todos'}
              onClick={() => setFiltroActivo('todos')}
              count={publicaciones.length}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14-4H5m14 8H5" />
              </svg>
              Todos
            </TabButton>
            
            <TabButton
              active={filtroActivo === 'eventos'}
              onClick={() => setFiltroActivo('eventos')}
              count={publicaciones.filter(p => p.tipo === 'evento').length}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Eventos
            </TabButton>
            
            <TabButton
              active={filtroActivo === 'noticias'}
              onClick={() => setFiltroActivo('noticias')}
              count={publicaciones.filter(p => p.tipo === 'noticia').length}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Noticias
            </TabButton>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-600/20 border border-red-600 text-red-200 p-4 rounded-lg mb-6 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Loading inicial */}
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800/40 rounded-xl p-6 backdrop-blur-sm animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                    <div className="flex-1 space-y-4">
                      <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                      <div className="h-40 bg-gray-700 rounded"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Feed de publicaciones */}
              <div className="space-y-6">
                {publicacionesFiltradas.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="max-w-md mx-auto">
                      <svg className="w-24 h-24 mx-auto text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">
                        No hay {filtroActivo === 'todos' ? 'publicaciones' : filtroActivo} disponibles
                      </h3>
                      <p className="text-gray-500">
                        {filtroActivo === 'eventos' && 'Sé el primero en crear un evento'}
                        {filtroActivo === 'noticias' && 'Sé el primero en compartir una noticia'}
                        {filtroActivo === 'todos' && 'Sé el primero en crear contenido'}
                      </p>
                    </div>
                  </div>
                ) : (
                  publicacionesFiltradas.map((publicacion) => (
                    <article
                      key={publicacion.id}
                      className="bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-gray-800/60 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {/* Header de la publicación */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              publicacion.tipo === 'evento' ? 'bg-[#BFFF71]' : 'bg-blue-500'
                            }`}>
                              {publicacion.tipo === 'evento' ? (
                                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              ) : (
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">
                                  {publicacion.creador || 'SenaUnity'}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  publicacion.tipo === 'evento'
                                    ? 'bg-[#BFFF71] text-black'
                                    : 'bg-blue-500 text-white'
                                }`}>
                                  {publicacion.tipo === 'evento' ? 'Evento' : 'Noticia'}
                                </span>
                              </div>
                              <p className="text-gray-400 text-sm">
                                {formatearFecha(publicacion.fechaCreacion)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Título y descripción */}
                      <div className="px-6 pb-4">
                        <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">
                          {publicacion.titulo}
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                          {truncateText(publicacion.descripcion, 200)}
                        </p>
                      </div>

                      {/* Imagen */}
                      {publicacion.imagen && (
                        <div className="relative">
                          <img
                            src={publicacion.imagen}
                            alt={publicacion.titulo}
                            className="w-full h-64 md:h-80 object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = slider1;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                      )}

                      {/* Footer con información adicional */}
                      <div className="p-6 pt-4">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            {publicacion.fecha && (
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formatearFecha(publicacion.fecha)}
                              </div>
                            )}
                            {publicacion.ubicacion && (
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {publicacion.ubicacion}
                              </div>
                            )}
                          </div>
                          
                          <Link
                            to={`/${publicacion.tipo}/${publicacion.id.split('-')[1]}`}
                            className="inline-flex items-center gap-2 text-[#BFFF71] hover:text-white transition-colors duration-300 font-medium group"
                          >
                            Ver más
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>

              {/* Botón para cargar más (simulado) */}
              {hasMore && !loading && publicacionesFiltradas.length > 0 && (
                <div className="text-center pt-8">
                  <button
                    onClick={() => fetchPublicaciones(false)}
                    disabled={loadingMore}
                    className="bg-gray-800/50 hover:bg-gray-700/50 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                  >
                    {loadingMore ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Cargando más...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        Cargar más publicaciones
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EventosNoticias; 