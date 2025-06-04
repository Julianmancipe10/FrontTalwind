import React from 'react';

const MapaModal = ({ show, onClose, mapaUrl }) => {
  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="relative w-[90%] max-w-4xl h-[80vh] md:h-[70vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 bg-black/70 hover:bg-red-600/80 text-white w-9 h-9 rounded-full flex items-center justify-center text-2xl font-bold transition-colors duration-300 z-[60]"
          onClick={onClose}
        >
          ×
        </button>
        <iframe
          title="Mapa"
          src={mapaUrl}
          className="w-full h-full rounded-2xl"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default MapaModal;
