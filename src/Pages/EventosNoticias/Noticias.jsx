import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import PermissionWrapper from "../../components/PermissionWrapper/PermissionWrapper";
import { PERMISOS } from "../../constants/roles";

import noticia1 from "../../assets/images/optimized/optimized_slider1.jpg";
import noticia2 from "../../assets/images/optimized/optimized_slider2.jpg";
import noticia3 from "../../assets/images/optimized/optimized_slider3.jpg";

const cards = [
  {
    id: 1,
    image: noticia1,
    badge: "Titulo",
    title: "Pequeña descrpcion de la noticia",
    description: ""
  },
  {
    id: 2,
    image: noticia2,
    badge: "Titulo",
    title: "Pequeña descrpcion de la segunda noticia",
    description: ""
  },
  {
    id: 3,
    image: noticia3,
    badge: "Titulo",
    title: "Pequeña descrpcion de la tercera noticia y así sucesivamente",
    description: ""
  }
];

const Noticias = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const cardsContainerRef = useRef(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imagePromises = cards.map((card) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = card.image;
            img.onload = resolve;
            img.onerror = reject;
          });
        });
        
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error al cargar las imágenes:', error);
        setImagesLoaded(true);
      }
    };
    
    loadImages();
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
    <div className="relative px-4 py-6">
      {/* Título y botón de crear */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#BFFF71]">
          Noticias
        </h2>
        
        <PermissionWrapper requiredPermissions={[PERMISOS.CREAR_NOTICIA]}>
          <Link
            to="/crear-noticia"
            className="bg-[#BFFF71] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#a6e85c] transition-colors duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Crear Noticia
          </Link>
        </PermissionWrapper>
      </div>

      <div className="relative">
        {/* Navigation Buttons */}
        <button 
          className="absolute left-2 top-1/2 z-10 transform -translate-y-1/2 p-2 rounded-full hover:bg-gray-800/50 transition-all duration-300 focus:outline-none hidden md:block"
          onClick={() => scroll('left')}
        >
          <svg className="w-8 h-8" viewBox="0 0 48 48">
            <polyline points="30,36 18,24 30,12" stroke="#BFFF71" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </button>

        {/* Cards Container */}
        <div 
          ref={cardsContainerRef}
          className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-6 pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {imagesLoaded ? (
            cards.map((card) => (
              <div
                key={card.id}
                className="flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start"
              >
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#BFFF71]/20">
                  <div className="relative aspect-video">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block px-3 py-1 bg-[#BFFF71] text-black text-sm font-semibold rounded-full mb-2">
                        {card.badge}
                      </span>
                      <h3 className="text-white text-lg font-semibold line-clamp-2">
                        {card.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <Link
                      to={`/noticia/${card.id}`}
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
          ) : (
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
          )}
        </div>

        {/* Right Navigation Button */}
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
  );
};

export default Noticias;
