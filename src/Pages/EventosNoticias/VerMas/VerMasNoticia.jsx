import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../../Layouts/Header/Header';
import slider1 from '../../../assets/images/optimized/optimized_slider1.jpg';
import slider2 from '../../../assets/images/optimized/optimized_slider2.jpg';
import slider3 from '../../../assets/images/optimized/optimized_slider3.jpg';

// Simulación de datos de noticias
const noticias = [
  {
    id: '1',
    titulo: 'SENA Quindío inaugura nuevo laboratorio de innovación',
    fecha: '2024-02-15',
    enlace: 'https://www.sena.edu.co',
    imagen: slider1,
    descripcion: 'El Centro de Comercio y Turismo Regional Quindío del SENA inauguró un moderno laboratorio de innovación tecnológica, equipado con las últimas tecnologías para el desarrollo de proyectos innovadores. Este espacio permitirá a los aprendices trabajar en proyectos de vanguardia y desarrollar habilidades en áreas como inteligencia artificial, robótica y desarrollo de software.',
    infoAdicional: 'El laboratorio cuenta con equipos de última generación y está disponible para todos los aprendices del centro. Se realizarán talleres semanales para familiarizar a los estudiantes con las nuevas tecnologías.'
  },
  {
    id: '2',
    titulo: 'Aprendices del SENA ganan competencia nacional',
    fecha: '2024-02-20',
    enlace: 'https://www.sena.edu.co/tecnologia',
    imagen: slider2,
    descripcion: 'Un equipo de aprendices del programa de Tecnología en Desarrollo de Software del SENA Quindío obtuvo el primer lugar en la competencia nacional de programación. El proyecto ganador consistió en una aplicación móvil para la gestión de recursos hídricos en zonas rurales.',
    infoAdicional: 'El equipo ganador recibirá una beca para participar en la competencia internacional que se realizará en Brasil el próximo mes. Los aprendices fueron asesorados por instructores especializados en desarrollo móvil.'
  },
  {
    id: '3',
    titulo: 'SENA firma alianza estratégica con empresas tecnológicas',
    fecha: '2024-03-10',
    enlace: 'https://www.sena.edu.co/robotica',
    imagen: slider3,
    descripcion: 'El SENA Quindío estableció una alianza estratégica con importantes empresas del sector tecnológico para fortalecer la formación de aprendices y facilitar su inserción laboral. Esta alianza incluye programas de pasantías, mentorías y proyectos conjuntos de investigación.',
    infoAdicional: 'Las empresas aliadas ofrecerán 50 cupos para pasantías remuneradas y 100 becas para certificaciones técnicas. Los aprendices seleccionados recibirán mentoría personalizada de profesionales del sector.'
  }
];

const VerMasNoticia = () => {
  const { id } = useParams();
  const noticia = noticias.find(n => n.id === id);

  if (!noticia) return (
    <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center">
      <p className="text-white text-xl">Noticia no encontrada</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1f2e] font-['Poppins'] pb-10 pt-8">
      <Header />
      <h2 className="text-5xl font-bold text-[#BFFF71] text-center mt-24 mb-2 uppercase">Noticias</h2>
      
      <div className="max-w-[90%] lg:max-w-[80%] xl:max-w-[60%] mx-auto mt-6 bg-[#1b1b1b] rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[#BFFF71]">{noticia.titulo}</h1>
          <p className="text-lg text-gray-400">{noticia.fecha}</p>
          <div>
            <a 
              href={noticia.enlace} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-[#BFFF71] text-[#232323] px-6 py-2 rounded-lg font-medium hover:bg-[#a6e85c] transition-colors duration-200"
            >
              Enlace
            </a>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-4">
          <div className="lg:w-3/5">
            <div className="rounded-xl overflow-hidden bg-[#111111]">
              <img 
                src={noticia.imagen} 
                alt={noticia.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {noticia.infoAdicional !== undefined && (
            <aside className="lg:w-2/5 bg-[#1b1b1b] rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#BFFF71] mb-3">
                Información adicional
              </h3>
              <p className="text-white text-lg">
                {noticia.infoAdicional.trim() !== '' ? noticia.infoAdicional : 'No hay información adicional por ahora'}
              </p>
            </aside>
          )}
        </div>

        <div className="text-gray-200 text-lg leading-relaxed mt-4">
          {noticia.descripcion}
        </div>
      </div>
    </div>
  );
};

export default VerMasNoticia;
