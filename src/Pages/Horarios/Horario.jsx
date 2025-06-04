import React from 'react';
import { Header } from '../../Layouts/Header/Header';
import cronogramaImg from '../../assets/images/cronograma.png';
import rolImg from '../../assets/images/selecciona_tu_rol.png';
import camposImg from '../../assets/images/completa_los_campos.png';

const Horario = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-poppins pt-32 px-4 md:px-6 lg:px-8">
      <Header />

      <main className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-16 leading-tight">
          PARA VER TU HORARIO ES MUY SENCILLO<br />
          SOLO TIENES QUE SEGUIR LOS SIGUIENTES PASOS
        </h1>

        <div className="space-y-16">
          {/* Paso 1 */}
          <section className="bg-gray-800/50 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl md:text-2xl">
              Paso 1. entra al siguiente link{' '}
              <a 
                href="https://cct.sisge.space/" 
                target="_blank" 
                rel="noreferrer" 
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                cct.sisge.space
              </a>{' '}
              (sistema de gestor educativo)
            </h2>
          </section>

          {/* Paso 2 */}
          <section className="bg-gray-800/50 rounded-xl p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2">
                <h2 className="text-xl md:text-2xl mb-4">
                  Paso 2. selecciona{' '}
                  <span className="text-emerald-400">Cronograma de formación</span>
                </h2>
              </div>
              <div className="lg:w-1/2">
                <img 
                  src={cronogramaImg} 
                  alt="Pantalla de bienvenida SISGE" 
                  className="rounded-lg shadow-xl w-full hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </section>

          {/* Paso 3 */}
          <section className="bg-gray-800/50 rounded-xl p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
              <div className="lg:w-1/2">
                <h2 className="text-xl md:text-2xl mb-4">
                  Paso 3. selecciona tu <span className="text-emerald-400">ROL</span>
                </h2>
              </div>
              <div className="lg:w-1/2">
                <img 
                  src={rolImg} 
                  alt="Seleccionar ROL" 
                  className="rounded-lg shadow-xl w-full hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </section>

          {/* Paso 4 */}
          <section className="bg-gray-800/50 rounded-xl p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2">
                <h2 className="text-xl md:text-2xl mb-4">
                  Paso 4. completa los{' '}
                  <span className="text-emerald-400">campos</span>{' '}
                  correctamente y ¡listo! podrás ver tu horario de clase
                </h2>
              </div>
              <div className="lg:w-1/2">
                <img 
                  src={camposImg} 
                  alt="Formulario Cronograma" 
                  className="rounded-lg shadow-xl w-full hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Horario;
