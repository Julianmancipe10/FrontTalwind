import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import imgOportunidades from "../../assets/images/optimized/optimized_fondoProgramas.png";

const Programas = () => {
  const navigate = useNavigate();
  const descripcion = "Un mundo de oportunidades te espera";
  const [hoveredOption, setHoveredOption] = useState(null);

  const opciones = [
    {
      id: 1,
      imagen: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23BFFF71' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'%3E%3C/path%3E%3Cline x1='12' y1='11' x2='12' y2='17'%3E%3C/line%3E%3Cline x1='9' y1='14' x2='15' y2='14'%3E%3C/line%3E%3C/svg%3E",
      alt: "Carreras tecnológicas",
      texto: "Carreras Tecnológicas",
      descripcion: "Explora nuestras carreras tecnológicas y forma parte del futuro digital",
      ruta: "/carreras-tecnologicas"
    },
    {
      id: 2,
      imagen: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23BFFF71' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M8 14s1.5 2 4 2 4-2 4-2'%3E%3C/path%3E%3Cline x1='9' y1='9' x2='9.01' y2='9'%3E%3C/line%3E%3Cline x1='15' y1='9' x2='15.01' y2='9'%3E%3C/line%3E%3C/svg%3E",
      alt: "Carreras cortas",
      texto: "Carreras Cortas",
      descripcion: "Programas especializados para una rápida inserción laboral",
      ruta: "/carreras-cortas"
    }
  ];

  const handleMouseEnter = (id) => {
    setHoveredOption(id);
  };

  const handleMouseLeave = () => {
    setHoveredOption(null);
  };

  const handleCardClick = (ruta) => {
    navigate(ruta);
  };

  return (
    <section className="w-full py-8 px-4">
      <hr className="w-11/12 h-[3px] bg-white mx-auto my-6" />
      
      <div className="relative w-11/12 mx-auto min-h-[850px] rounded-2xl overflow-hidden">
        {/* Imagen de fondo con efecto parallax */}
        <div className="absolute inset-0 transform hover:scale-105 transition-transform duration-1000">
          <img 
            src={imgOportunidades} 
            alt="Oportunidades" 
            className="absolute inset-0 w-full h-full object-cover filter blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
        </div>

        {/* Contenido */}
        <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-8 font-poppins text-center animate-fade-in">
            Programas de Formación
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white font-bold font-poppins italic mb-16 text-center max-w-3xl animate-slide-up">
            {descripcion}
          </p>

          {/* Contenedor de tarjetas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mt-8">
            {opciones.map((opcion) => (
              <div
                key={opcion.id}
                onClick={() => handleCardClick(opcion.ruta)}
                className={`
                  cursor-pointer transform transition-all duration-500 ease-in-out
                  bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 border-2
                  hover:bg-gray-800/95 group
                  ${hoveredOption === opcion.id 
                    ? 'scale-105 shadow-2xl shadow-accent-green/30 border-accent-green bg-gray-800/95' 
                    : 'border-gray-700 hover:border-accent-green/50 hover:scale-102 hover:shadow-lg hover:shadow-accent-green/10'}
                `}
                onMouseEnter={() => handleMouseEnter(opcion.id)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex flex-col items-center space-y-6">
                  <div className={`
                    w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300
                    ${hoveredOption === opcion.id 
                      ? 'bg-accent-green/20 ring-4 ring-accent-green shadow-lg shadow-accent-green/30' 
                      : 'bg-gray-800/80 group-hover:bg-accent-green/10 group-hover:ring-2 group-hover:ring-accent-green/50'}
                  `}>
                    <img 
                      src={opcion.imagen} 
                      alt={opcion.alt}
                      className="w-14 h-14 transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="text-center flex-1">
                    <h3 className={`
                      text-2xl font-bold mb-4 transition-colors duration-300
                      ${hoveredOption === opcion.id ? 'text-accent-green' : 'text-white group-hover:text-accent-green'}
                    `}>
                      {opcion.texto}
                    </h3>
                    
                    <p className="text-gray-300 group-hover:text-gray-100 transition-colors duration-300 text-center leading-relaxed mb-6">
                      {opcion.descripcion}
                    </p>
                    
                    <div className={`
                      inline-block px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer
                      ${hoveredOption === opcion.id 
                        ? 'bg-accent-green text-black shadow-lg transform scale-105' 
                        : 'bg-gray-700/50 text-gray-300 group-hover:bg-accent-green/20 group-hover:text-accent-green border border-gray-600 group-hover:border-accent-green/50'}
                    `}>
                      Explorar Programa
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="w-11/12 h-[3px] bg-white mx-auto my-6" />
    </section>
  );
};

export default Programas; 