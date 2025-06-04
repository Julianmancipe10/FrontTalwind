import React from 'react';

const InstructorModal = ({ instructor, onClose }) => {
  if (!instructor) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 overflow-y-auto">
      <div className="bg-[#242937] rounded-2xl w-full max-w-4xl overflow-hidden relative animate-fadeIn shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02] my-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-400 hover:text-white transition-colors duration-200 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 relative group">
            <div className="aspect-[4/3] md:aspect-[3/4] overflow-hidden">
              <img
                src={instructor.imagen}
                alt={instructor.nombre}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#242937] via-transparent to-transparent opacity-70"></div>
            </div>
          </div>

          <div className="p-4 md:p-8 w-full md:w-1/2 space-y-4 md:space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-4 leading-tight">{instructor.nombre}</h2>
            
            <div className="flex items-center mb-4 md:mb-6">
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-xl md:text-2xl transition-colors duration-200 ${
                      i < instructor.calificacion ? 'text-yellow-400' : 'text-gray-600'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="ml-2 text-gray-400 text-xs md:text-sm">
                ({instructor.calificacion} de 5)
              </span>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="transform transition-all duration-300 hover:translate-x-2">
                <h3 className="text-base md:text-lg font-semibold text-green-400 mb-1 md:mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Especialidad
                </h3>
                <p className="text-gray-300 text-sm md:text-base">{instructor.especialidad}</p>
              </div>

              <div className="transform transition-all duration-300 hover:translate-x-2">
                <h3 className="text-base md:text-lg font-semibold text-green-400 mb-1 md:mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Experiencia
                </h3>
                <p className="text-gray-300 text-sm md:text-base">{instructor.experiencia}</p>
              </div>

              <div className="transform transition-all duration-300 hover:translate-x-2">
                <h3 className="text-base md:text-lg font-semibold text-green-400 mb-1 md:mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Cursos
                </h3>
                <ul className="list-none space-y-1 md:space-y-2 text-gray-300">
                  {instructor.cursos.map((curso, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm md:text-base">
                      <span className="text-green-400">•</span>
                      {curso}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="transform transition-all duration-300 hover:translate-x-2">
                <h3 className="text-base md:text-lg font-semibold text-green-400 mb-1 md:mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contacto
                </h3>
                <p className="text-gray-300 text-sm md:text-base hover:text-green-400 transition-colors duration-200">{instructor.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorModal; 