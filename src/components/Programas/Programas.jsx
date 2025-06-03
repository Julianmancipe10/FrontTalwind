import React, { useState } from "react";
import "./Programas.css";
import imgOportunidades from "../../assets/images/fondoProgramas.png";

const Programas = () => {
  const descripcion = "Un mundo de oportunidades te espera";
  const [hoveredOption, setHoveredOption] = useState(null);

  const opciones = [
    {
      id: 1,
      imagen: "/imagenes/carreras-presenciales.png",
      alt: "Carreras presenciales",
      texto: "Carreras Tecnologas"
    },
    {
      id: 2,
      imagen: "/imagenes/carreras-cortas.png",
      alt: "Carreras cortas",
      texto: "Carreras Cortas"
    },
    {
      id: 3,
      imagen: "/imagenes/cursos-ingles.png",
      alt: "Cursos de inglés",
      texto: "Cursos de inglés"
    }
  ];

  const handleMouseEnter = (id) => {
    setHoveredOption(id);
  };

  const handleMouseLeave = () => {
    setHoveredOption(null);
  };

  return (
    <section className="oportunidades-section">
      <hr className="divider" />
      <div className="oportunidades-container">
        <h1 className="titulo-oportunidades">Programas de Formación</h1>
        <p className="descripcion-oportunidades">
          {descripcion}
        </p>
        <img src={imgOportunidades} alt="Oportunidades" className="oportunidades-img" />
        <div className="opciones-container">
          {opciones.map((opcion) => (
            <div 
              key={opcion.id}
              className={`opcion-base ${hoveredOption === opcion.id ? 'opcion-hover' : ''}`}
              onMouseEnter={() => handleMouseEnter(opcion.id)}
              onMouseLeave={handleMouseLeave}
            >
              <img src={opcion.imagen} alt={opcion.alt} />
              <p className={hoveredOption === opcion.id ? 'texto-hover' : ''}>
                <strong>{opcion.texto}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>
      <hr className="divider bottom-divider" />
    </section>
  );
};

export default Programas; 