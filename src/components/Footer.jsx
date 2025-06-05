import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sección del logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">SENA Unity</h2>
            <p className="text-gray-400 mb-4">
              Formando profesionales integrales para el futuro de Colombia.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/SENA" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com/SENAComunica" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com/senacomunica" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Inicio</Link></li>
              <li><Link to="/carreras-tecnologicas" className="text-gray-400 hover:text-white transition-colors">Carreras Tecnológicas</Link></li>
              <li><Link to="/eventos" className="text-gray-400 hover:text-white transition-colors">Eventos</Link></li>
              <li><Link to="/horarios" className="text-gray-400 hover:text-white transition-colors">Horarios</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-400">
              <li>📍 Calle 57 No. 8-69, Bogotá D.C.</li>
              <li>📞 (57 1) 546 1500</li>
              <li>✉️ servicioalciudadano@sena.edu.co</li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} SENA Unity. Todos los derechos reservados.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-4 text-sm text-gray-400">
                <li><Link to="/faq" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">Privacidad</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">Ayuda</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 