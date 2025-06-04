import React, { useState } from "react";
import imgOportunidades from "../../assets/images/optimized/optimized_fondoProgramas.png";

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
    <section className="w-full py-8 px-4">
      <hr className="w-11/12 h-[3px] bg-white mx-auto my-6" />
      
      <div className="relative w-11/12 mx-auto min-h-[850px] rounded-2xl overflow-hidden">
        {/* Imagen de fondo */}
        <img 
          src={imgOportunidades} 
          alt="Oportunidades" 
          className="absolute inset-0 w-full h-full object-cover filter blur-sm"
        />
        
        {/* Overlay oscuro para mejor contraste */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Contenido */}
        <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 font-poppins text-center">
            Programas de Formación
          </h1>
          
          <p className="text-xl md:text-2xl text-white font-bold font-poppins italic mb-16 text-center">
            {descripcion}
          </p>

          {/* Contenedor de tarjetas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mt-8">
            {opciones.map((opcion) => (
              <div
                key={opcion.id}
                className={`
                  transform transition-all duration-300 ease-in-out
                  bg-white/90 rounded-2xl p-4 flex flex-col items-center
                  ${hoveredOption === opcion.id ? 'scale-105 shadow-xl border-2 border-[#BFFF71]' : 'shadow-lg hover:shadow-xl'}
                `}
                onMouseEnter={() => handleMouseEnter(opcion.id)}
                onMouseLeave={handleMouseLeave}
              >
                <img 
                  src={opcion.imagen} 
                  alt={opcion.alt}
                  className="w-full h-auto rounded-lg object-cover"
                />
                <p className={`
                  mt-4 text-lg md:text-xl font-bold font-poppins text-center
                  ${hoveredOption === opcion.id ? 'bg-gray-800 text-[#BFFF71] px-4 py-2 rounded-lg' : 'text-gray-800'}
                `}>
                  {opcion.texto}
                </p>
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