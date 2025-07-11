import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { Header } from "../../Layouts/Header/Header";
import PermissionWrapper from "../../components/PermissionWrapper/PermissionWrapper";
import { PERMISOS } from "../../constants/roles";
import { getEventos } from "../../services/publicaciones";
import { getImageUrl } from "../../services/config";

// Fallback para imágenes por defecto
import slider1 from "../../assets/images/optimized/optimized_slider1.jpg";
import slider2 from "../../assets/images/optimized/optimized_slider2.jpg";
import slider3 from "../../assets/images/optimized/optimized_slider3.jpg";

const defaultCards = [
  {
    id: 1,
    image: slider1,
    badge: "Evento de ejemplo",
    title: "No hay eventos disponibles",
    description: "Sé el primero en crear un evento"
  },
  {
    id: 2,
    image: slider2,
    badge: "Evento de ejemplo",
    title: "Crea eventos increíbles",
    description: "Comparte tus eventos con la comunidad"
  },
  {
    id: 3,
    image: slider3,
    badge: "Evento de ejemplo",
    title: "Conecta con otros aprendices",
    description: "Los eventos son una gran manera de socializar"
  }
];

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardsContainerRef = useRef(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        const eventosData = await getEventos();
        
        if (eventosData && eventosData.length > 0) {
          // Convertir datos del backend al formato esperado
          const eventosFormateados = eventosData.map(evento => ({
            id: evento.ID_Evento,
            image: evento.ImagenSlider ? getImageUrl(evento.ImagenSlider) : slider1,
            badge: "Evento",
            title: evento.Nombre,
            description: evento.Descripción?.substring(0, 100) + (evento.Descripción?.length > 100 ? '...' : ''),
            fecha: evento.Fecha,
            ubicacion: evento.Ubicacion,
            creador: `${evento.CreadorNombre || ''} ${evento.CreadorApellido || ''}`.trim()
          }));
          setEventos(eventosFormateados);
        } else {
          // Si no hay eventos, usar los de ejemplo
          setEventos(defaultCards);
        }
        
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        setError('Error al cargar eventos');
        // En caso de error, usar eventos de ejemplo
        setEventos(defaultCards);
        setImagesLoaded(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  const scroll = (direction) => {
    if (cardsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      cardsContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <Header />
      
      <div className="relative px-4 py-6">
        {/* Título y botón de crear */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#BFFF71]">
            Eventos
          </h2>
          
          <PermissionWrapper requiredPermissions={[PERMISOS.CREAR_EVENTO]}>
            <Link
              to="/crear-evento"
              className="bg-[#BFFF71] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#a6e85c] transition-colors duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Crear Evento
            </Link>
          </PermissionWrapper>
        </div>

        {error && (
          <div className="bg-red-600/20 text-red-200 p-4 rounded-lg mb-4 border border-red-600">
            {error}
          </div>
        )}

        <div className="relative">
          <button 
            className="absolute left-2 top-1/2 z-10 transform -translate-y-1/2 p-2 rounded-full hover:bg-gray-800/50 transition-all duration-300 focus:outline-none hidden md:block"
            onClick={() => scroll('left')}
          >
            <svg className="w-8 h-8" viewBox="0 0 48 48">
              <polyline points="30,36 18,24 30,12" stroke="#BFFF71" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>

          <div 
            ref={cardsContainerRef}
            className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-6 pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {loading ? (
              <div className="flex justify-center items-center h-72 w-full text-white text-lg font-medium">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-gray-700 h-12 w-12"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              eventos.map((evento) => (
                <div
                  key={evento.id}
                  className="flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start"
                >
                  <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#BFFF71]/20">
                    <div className="relative aspect-video">
                      <img
                        src={evento.image}
                        alt={evento.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = slider1; // Fallback image
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="inline-block px-3 py-1 bg-[#BFFF71] text-black text-sm font-semibold rounded-full mb-2">
                          {evento.badge}
                        </span>
                        <h3 className="text-white text-lg font-semibold line-clamp-2">
                          {evento.title}
                        </h3>
                        {evento.creador && (
                          <p className="text-gray-300 text-sm mt-1">
                            Por: {evento.creador}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <Link
                        to={`/evento/${evento.id}`}
                        className="inline-flex items-center text-[#BFFF71] hover:text-white transition-colors duration-300 group"
                      >
                        Ver más
                        <span className="ml-2 w-8 h-8 flex items-center justify-center rounded-full border border-[#BFFF71] group-hover:bg-[#BFFF71] group-hover:border-[#BFFF71] transition-all duration-300">
                          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" 
                               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button 
            className="absolute right-2 top-1/2 z-10 transform -translate-y-1/2 p-2 rounded-full hover:bg-gray-800/50 transition-all duration-300 focus:outline-none hidden md:block"
            onClick={() => scroll('right')}
          >
            <svg className="w-8 h-8" viewBox="0 0 48 48">
              <polyline points="18,12 30,24 18,36" stroke="#BFFF71" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Eventos;