import React from 'react';
import { Header } from '../../Layouts/Header/Header';
import './Contacto.css';

const Contacto = () => {
  return (
    <div className="contacto-container">
      <Header />
      <main className="contacto-main">
        <h1 className="titulo">Contáctanos</h1>
        
        <div className="contacto-content">
          <div className="contacto-info">
            <h2>Información de Contacto</h2>
            <div className="info-item">
              <i className="fas fa-phone"></i>
              <p>Teléfono: (67) 494999</p>
            </div>
            <div className="info-item">
              <i className="fas fa-envelope"></i>
              <p>Email: servicioalciudadano@sena.edu.co</p>
            </div>
            <div className="info-item">
              <i className="fas fa-map-marker-alt"></i>
              <p>Dirección: Cra. 18 #7-58, Armenia, Quindío</p>
            </div>
          </div>
          
          <form className="contacto-form">
            <div className="form-group">
              <input type="text" placeholder="Nombre completo" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Correo electrónico" required />
            </div>
            <div className="form-group">
              <input type="text" placeholder="Asunto" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Mensaje" required></textarea>
            </div>
            <button type="submit" className="btn-enviar">Enviar mensaje</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Contacto;