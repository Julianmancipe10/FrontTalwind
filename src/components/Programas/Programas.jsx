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
                  bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 
                  hover:bg-gray-800/90 group
                  ${hoveredOption === opcion.id ? 'scale-105 shadow-xl shadow-[#BFFF71]/20' : 'hover:scale-102 hover:shadow-lg'}
                `}
                onMouseEnter={() => handleMouseEnter(opcion.id)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex flex-col items-center space-y-6">
                  <div className={`
                    w-24 h-24 rounded-full flex items-center justify-center
                    bg-gray-800 group-hover:bg-gray-700 transition-colors duration-300
                    ${hoveredOption === opcion.id ? 'ring-4 ring-[#BFFF71]' : ''}
                  `}>
                    <img 
                      src={opcion.imagen} 
                      alt={opcion.alt}
                      className="w-12 h-12 transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="text-center">
                    <h3 className={`
                      text-2xl font-bold mb-3 transition-colors duration-300
                      ${hoveredOption === opcion.id ? 'text-[#BFFF71]' : 'text-white group-hover:text-[#BFFF71]'}
                    `}>
                      {opcion.texto}
                    </h3>
                    
                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                      {opcion.descripcion}
                    </p>
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