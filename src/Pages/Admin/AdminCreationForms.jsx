import React, { useState } from 'react';
import CrearEvento from '../../EventosNoticias/CrearEvento/CrearEvento';
import CrearNoticia from '../../EventosNoticias/CrearNoticia/CrearNoticia';

const AdminCreationForms = () => {
  const [formType, setFormType] = useState('evento');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Crear Contenido
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Selecciona el tipo de contenido que deseas crear
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button 
              className={`flex-1 py-4 px-6 text-center text-sm font-medium transition-colors duration-200 ease-in-out
                ${formType === 'evento' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setFormType('evento')}
            >
              Crear Evento
            </button>
            <button 
              className={`flex-1 py-4 px-6 text-center text-sm font-medium transition-colors duration-200 ease-in-out
                ${formType === 'noticia' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setFormType('noticia')}
            >
              Crear Noticia
            </button>
          </div>

          <div className="p-6">
            {formType === 'evento' ? <CrearEvento /> : <CrearNoticia />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreationForms;
