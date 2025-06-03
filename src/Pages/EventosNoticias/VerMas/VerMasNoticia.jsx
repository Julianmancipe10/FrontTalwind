import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../../Layouts/Header/Header';
import './VerMasNoticia.css';
import slider1 from '../../../assets/images/slider1.jpg';
import slider2 from '../../../assets/images/slider2.jpg';
import slider3 from '../../../assets/images/slider3.jpg';

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

  if (!noticia) return <div>Noticia no encontrada</div>;

  return (
    <div className="noticia-container">
      <Header />
      <h2 className="noticia-section-title">Noticias</h2>
      <div className="noticia-card">
        <div className="noticia-info">
          <div className="noticia-titulo">{noticia.titulo}</div>
          <div className="noticia-fecha">{noticia.fecha}</div>
          <div className="noticia-enlace">
            <a href={noticia.enlace} target="_blank" rel="noopener noreferrer">Enlace</a>
          </div>
        </div>
        <div className="noticia-content-row-wrapper">
          <div className="noticia-content-row">
            <div className="noticia-imagen">
              <img src={noticia.imagen} alt={noticia.titulo} />
            </div>
            {noticia.infoAdicional !== undefined && (
              <aside className="noticia-info-adicional">
                <h3>Información adicional</h3>
                <p>{noticia.infoAdicional.trim() !== '' ? noticia.infoAdicional : 'No hay información adicional por ahora'}</p>
              </aside>
            )}
          </div>
        </div>
        <div className="noticia-descripcion">
          {noticia.descripcion}
        </div>
      </div>
    </div>
  );
};

export default VerMasNoticia;
