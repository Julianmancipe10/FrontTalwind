import React from 'react'

export const SectionHome = () => {
  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black py-8 px-4 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto">
        {/* Layout Principal */}
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          {/* Sección Principal */}
          <div className="w-full lg:w-2/3 space-y-8">
            {/* Encabezado */}
            <div className="font-poppins">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Bienvenido a <span className="text-[#BFFF71]">SenaUnity</span>
              </h1>
              <p className="mt-4 text-lg md:text-xl text-gray-300">
                Tu plataforma integral para mantenerte conectado con el SENA
              </p>
            </div>

            {/* Sección de Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tarjeta 1 */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#BFFF71]/20">
                <h2 className="text-2xl font-bold text-white mb-4">Eventos</h2>
                <p className="text-gray-300">Mantente al día con los últimos eventos y actividades del SENA.</p>
              </div>

              {/* Tarjeta 2 */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#BFFF71]/20">
                <h2 className="text-2xl font-bold text-white mb-4">Noticias</h2>
                <p className="text-gray-300">Descubre las últimas novedades y actualizaciones importantes.</p>
              </div>
            </div>
          </div>

          {/* Sección Lateral */}
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Enlaces Rápidos</h2>
              <nav className="space-y-4">
                <a href="#" className="block text-gray-300 hover:text-[#BFFF71] transition-colors duration-300">
                  Programas de Formación
                </a>
                <a href="#" className="block text-gray-300 hover:text-[#BFFF71] transition-colors duration-300">
                  Calendario Académico
                </a>
                <a href="#" className="block text-gray-300 hover:text-[#BFFF71] transition-colors duration-300">
                  Recursos Educativos
                </a>
                <a href="#" className="block text-gray-300 hover:text-[#BFFF71] transition-colors duration-300">
                  Contacto
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}