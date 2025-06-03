import React, { useState } from 'react';
import './NuestrasSedes.css';
import centro1 from '../../assets/images/centro1.jpg';
import MapaModal from '../../components/maps/MapaModal';

const NuestrasSedes = () => {
  const [mapaUrl, setMapaUrl] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);

  const abrirModalConMapa = (url) => {
    setMapaUrl(url);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setMapaUrl('');
  };

  return (
    <section className="sedes-section">
      <div className="sedes-container">
        <img src={centro1} alt="" className="fondo-sedes" />
        <h2 className="titulo-sedes">nuestras sedes</h2>

        {/* Sede 1 */}
        <div
          className="sede-card sede-galan"
          onClick={() =>
            abrirModalConMapa(
              "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.293399080443!2d-75.67304195702948!3d4.541112383694582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38f5aaa70689d1%3A0x46074d66ee20f3a2!2sSENA%20Centro%20de%20Comercio%20y%20Turismo%20Armenia%20Quindio!5e0!3m2!1ses-419!2sco!4v1747237047849!5m2!1ses-419!2sco" 
            )
          }
        >
          <h3 className="sede-titulo">Centro de Comercio, Industria y Turismo</h3>
          <p className="sede-direccion">Cra. 18 #7-58, Armenia, Quindío</p>
          <p className="sede-telefono">67494999</p>
        </div>

        {/* Sede 2 */}
        <div
          className="sede-card sede-agroindustrial"
          onClick={() =>
            abrirModalConMapa(
               "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.133295416476!2d-75.64107597171999!3d4.570059603396225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38f4b9cd820673%3A0xbc96f3b718e763e7!2sSENA%20-%20Agroindustrial!5e0!3m2!1ses-419!2sco!4v1747237406806!5m2!1ses-419!2sco" 
            )
          }
        >
          <h3 className="sede-titulo">Centro Agroindustrial</h3>
          <p className="sede-direccion">Cra. 6 #29 Norte-269 a 29 Norte-345, Armenia, Quindío</p>
          <p className="sede-telefono">67495738</p>
        </div>

        {/* Sede 3 */}
        <div
          className="sede-card sede-construccion"
          onClick={() =>
            abrirModalConMapa(
              "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.119427293414!2d-75.64246418952808!3d4.572558395382827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38f4b7194cb8fd%3A0x4f9c2cc28d9049!2sSENA%20-%20Centro%20para%20el%20Desarrollo%20Tecnol%C3%B3gico%20de%20la%20Construcci%C3%B3n%20y%20la%20Industria!5e0!3m2!1ses-419!2sco!4v1747237542298!5m2!1ses-419!2sco" 
            )
          }
        >
          <h3 className="sede-titulo">Centro para el Desarrollo Tecnológico de la Construcción</h3>
          <p className="sede-direccion">Cra. 6 #47 Norte-15, Armenia, Salento, Quindío</p>
          <p className="sede-telefono">67498118</p>
        </div>

        {/* MODAL DEL MAPA */}
        <MapaModal show={modalAbierto} onClose={cerrarModal} mapaUrl={mapaUrl} />
      </div>
    </section>
  );
};

export default NuestrasSedes;
