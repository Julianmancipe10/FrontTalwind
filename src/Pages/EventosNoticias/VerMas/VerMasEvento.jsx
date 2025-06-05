import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../../Layouts/Header/Header';
import slider1 from '../../../assets/images/optimized/optimized_slider1.jpg';
import slider2 from '../../../assets/images/optimized/optimized_slider2.jpg';
import slider3 from '../../../assets/images/optimized/optimized_slider3.jpg';

// Simulación de datos de eventos
const eventos = [
  {
    id: '1',
    titulo: 'Feria de Emprendimiento SENA',
    fecha: '2024-02-15',
    enlace: 'https://www.sena.edu.co',
    imagen: slider1,
    descripcion: 'Únete a la feria de emprendimiento donde los aprendices mostrarán sus proyectos innovadores.',
    infoAdicional: 'Esta es la información adicional para el evento 1'
  },
  {
    id: '2',
    titulo: 'Seminario de Tecnología',
    fecha: '2024-02-20',
    enlace: 'https://www.sena.edu.co/tecnologia',
    imagen: slider2,
    descripcion: 'Actualízate con las últimas tendencias en desarrollo de software y tecnologías emergentes.',
    infoAdicional: 'Esta es la información adicional para el evento 2'
  },
  {
    id: '3',
    titulo: 'Competencia Internacional de Robótica',
    fecha: '2024-03-10',
    enlace: 'https://www.sena.edu.co/robotica',
    imagen: slider3,
    descripcion: 'Aprendices del SENA ganan competencia internacional de robótica.',
    infoAdicional: 'Esta es la información adicional para el evento 3'
  }
];

const VerMasEvento = () => {
  const { id } = useParams();
  const evento = eventos.find(e => e.id === id);

  if (!evento) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-600">Evento no encontrado</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1f2e] font-['Poppins'] pb-10 pt-8">
      <Header />
      
      <h2 className="text-5xl font-bold text-center uppercase text-[#BFFF71] mt-24 mb-2 px-4">
        Eventos
      </h2>

      <div className="max-w-[90%] lg:max-w-[80%] xl:max-w-[60%] mx-auto mt-6 bg-[#1b1b1b] rounded-2xl shadow-lg p-6 md:p-8">
        <div className="space-y-3 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#BFFF71]">
            {evento.titulo}
          </h1>
          
          <p className="text-gray-300 text-lg">
            {evento.fecha}
          </p>
          
          <div>
            <a 
              href={evento.enlace} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-[#BFFF71] hover:bg-[#a6e85c] text-gray-900 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Enlace
            </a>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/5">
            <div className="rounded-xl overflow-hidden bg-gray-900">
              <img 
                src={evento.imagen} 
                alt={evento.titulo}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {evento.infoAdicional && (
            <aside className="lg:w-2/5 bg-[#1b1b1b] rounded-xl p-6 h-fit">
              <h3 className="text-xl font-bold text-[#BFFF71] mb-3">
                Información adicional
              </h3>
              <p className="text-gray-100">
                {evento.infoAdicional.trim() !== '' ? evento.infoAdicional : 'No hay información adicional por ahora'}
              </p>
            </aside>
          )}
        </div>

        <div className="mt-6 text-gray-100 text-lg leading-relaxed px-2">
          {evento.descripcion}
        </div>
      </div>
    </div>
  );
};

export default VerMasEvento;
