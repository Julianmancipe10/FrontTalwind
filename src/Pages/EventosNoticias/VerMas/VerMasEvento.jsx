import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../../Layouts/Header/Header';
import './VerMasEvento.css'; // Puedes crear este CSS para estilos propios
import slider1 from '../../../assets/images/slider1.jpg';
import slider2 from '../../../assets/images/slider2.jpg';
import slider3 from '../../../assets/images/slider3.jpg';

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

  if (!evento) return <div>Evento no encontrado</div>;

  return (
    <div className="vermas-container">
      <Header />
      <h2 className="evento-section-title">EVENTOS</h2>
      <div className="vermas-card">
        <div className="vermas-info">
          <div className="vermas-titulo">{evento.titulo}</div>
          <div className="vermas-fecha">{evento.fecha}</div>
          <div className="vermas-enlace">
            <a href={evento.enlace} target="_blank" rel="noopener noreferrer">Enlace</a>
          </div>
        </div>
        <div className="vermas-content-row-wrapper">
          <div className="vermas-content-row">
            <div className="vermas-imagen">
              <img src={evento.imagen} alt={evento.titulo} />
            </div>
            {evento.infoAdicional !== undefined && (
              <aside className="vermas-info-adicional">
                <h3>Información adicional</h3>
                <p>{evento.infoAdicional.trim() !== '' ? evento.infoAdicional : 'No hay información adicional por ahora'}</p>
              </aside>
            )}
          </div>
        </div>
        <div className="vermas-descripcion">
          {evento.descripcion}
        </div>
      </div>
    </div>
  );
};

export default VerMasEvento;
