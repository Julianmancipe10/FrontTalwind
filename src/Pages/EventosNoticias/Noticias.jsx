import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';

import "./Noticias.css"; // Cambiado para usar su propio archivo CSS
import noticia1 from "../../assets/images/optimized/optimized_slider1.jpg"; // Temporalmente usamos las mismas imágenes
import noticia2 from "../../assets/images/optimized/optimized_slider2.jpg"; // Puedes cambiarlas por imágenes específicas de noticias
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

  // Precargar todas las imágenes antes de mostrarlas
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
        // En caso de error, igualmente mostramos lo que podamos
        setImagesLoaded(true);
      }
    };
    
    loadImages();
  }, []);

  const scroll = (direction) => {
    if (cardsContainerRef.current) {
      const scrollAmount = 320; // Ajusta según el ancho de la card
      cardsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <div className="white-separator"></div>
    <div className="slider-container">
      <button className="slider-arrow left" onClick={() => scroll('left')}>
        <svg viewBox="0 0 48 48">
          <polyline points="30,12 18,24 30,36" stroke="#BFFF71" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </button>
      <h2 className="section-title">Últimas Noticias</h2>
      {imagesLoaded ? (
        <div className="cards-container" ref={cardsContainerRef}>
          {cards.map((card) => (
            <div className="card" key={card.id}>
              <div className="card-image-container">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="card-image"
                />
              </div>
              <div className="card-content">
                  <span className="card-title">{card.badge}</span>
                  <h3 className="card-description">{card.title}</h3>
                <Link to={`/noticia/${card.id}`} className="card-link">
                  Ver más
                  <span className="card-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 8l4 4-4 4"></path>
                      <path d="M8 12h8"></path>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="slider-loading">Cargando noticias...</div>
      )}
      <button className="slider-arrow right" onClick={() => scroll('right')}>
        <svg viewBox="0 0 48 48">
          <polyline points="18,12 30,24 18,36" stroke="#BFFF71" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </button>
    </div>
    </>
  );
};

export default Noticias;
