import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';

import "./Eventos.css";
import slider1 from "../../assets/images/optimized/optimized_slider1.jpg";
import slider2 from "../../assets/images/optimized/optimized_slider2.jpg";
import slider3 from "../../assets/images/optimized/optimized_slider3.jpg";

const cards = [
  {
    id: 1,
    image: slider1,
    badge: "Titulo",
    title: "Pequeña descrpcion del primer evento",
    description: ""
  },
  {
    id: 2,
    image: slider2,
    badge: "Titulo",
    title: "Pequeña descrpcion del segundo evento",
    description: ""
  },
  {
    id: 3,
    image: slider3,
    badge: "Titulo",
    title: "Pequeña descrpcion del tercer evento y así sucesivamente",
    description: ""
  }
];

const Slider = () => {
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
    <div className="slider-container">
      <button className="slider-arrow left" onClick={() => scroll('left')}>
        <svg viewBox="0 0 48 48">
          <polyline points="30,12 18,24 30,36" stroke="#BFFF71" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </button>
      <h2 className="section-title">Eventos</h2>
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
                <Link to={`/evento/${card.id}`} className="card-link">
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
        <div className="slider-loading">Cargando contenido...</div>
      )}
      <button className="slider-arrow right" onClick={() => scroll('right')}>
        <svg viewBox="0 0 48 48">
          <polyline points="18,12 30,24 18,36" stroke="#BFFF71" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </button>
    </div>
  );
};

export default Slider;