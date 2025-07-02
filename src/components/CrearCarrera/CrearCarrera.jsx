import React, { useState } from 'react';
import { Header } from '../../Layouts/Header/Header';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISOS } from '../../constants/roles';
import AccessDenied from '../AccessDenied/AccessDenied';
import { buildApiUrl } from '../../services/config';

const CrearCarrera = () => {
  // TODOS los hooks deben ir PRIMERO
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const [carrera, setCarrera] = useState({
    titulo: '',
    tipo: '',
    horas: '',
    descripcion: '',
    tituloObtener: '',
    ubicacion: '',
    visibleHasta: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Verificar permisos DESPUÉS de todos los hooks
  if (!hasPermission(PERMISOS.CREAR_CARRERA)) {
    return (
      <AccessDenied 
        message="No tienes permisos para crear carreras. Solo los instructores con permisos específicos pueden acceder a esta funcionalidad."
      />
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarrera(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (carrera.visibleHasta && new Date(carrera.visibleHasta) < new Date().setHours(0,0,0,0)) {
      setMessage({ type: 'error', text: 'La fecha de fin de visibilidad no puede ser en el pasado.' });
      setLoading(false);
      return;
    }

    try {
      console.log('Enviando carrera al backend...');
      
      const response = await fetch(buildApiUrl('/publicaciones/carreras'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          titulo: carrera.titulo,
          tipo: carrera.tipo,
          horas: carrera.horas,
          descripcion: carrera.descripcion,
          tituloObtener: carrera.tituloObtener,
          ubicacion: carrera.ubicacion,
          visibleHasta: carrera.visibleHasta
        })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `¡Carrera "${result.carrera.titulo}" creada exitosamente! ID: ${result.carrera.id}` 
        });
        
        console.log('Carrera creada:', result.carrera);
        
        // Limpiar formulario después del éxito
        setCarrera({ 
          titulo: '',
          tipo: '',
          horas: '',
          descripcion: '',
          tituloObtener: '',
          ubicacion: '',
          visibleHasta: ''
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: `Error al crear carrera: ${result.message}` 
        });
        console.error('Error del servidor:', result);
      }
    } catch (error) {
      console.error('Error al enviar carrera:', error);
      setMessage({ 
        type: 'error', 
        text: 'Error de conexión. Verifica que el servidor esté funcionando.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Atrás
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Crear Nueva Carrera Técnica</h2>
          
          {message.text && (
            <div className={`mb-6 p-4 rounded-md ${
              message.type === 'error' 
                ? 'bg-red-600/20 text-red-200 border border-red-600' 
                : 'bg-[#BFFF71]/20 text-[#BFFF71] border border-[#BFFF71]'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-white mb-1">
                Título de la Carrera
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={carrera.titulo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-[#BFFF71]"
              />
            </div>

            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-white mb-1">
                Tipo de Carrera
              </label>
              <select
                id="tipo"
                name="tipo"
                value={carrera.tipo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-[#BFFF71]"
              >
                <option value="">Seleccione una opción</option>
                <option value="Técnico">Técnico</option>
                <option value="Tecnólogo">Tecnólogo</option>
              </select>
            </div>

            <div>
              <label htmlFor="horas" className="block text-sm font-medium text-white mb-1">
                Duración (horas)
              </label>
              <input
                type="number"
                id="horas"
                name="horas"
                value={carrera.horas}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-[#BFFF71]"
              />
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-white mb-1">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={carrera.descripcion}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-[#BFFF71]"
              />
            </div>

            <div>
              <label htmlFor="tituloObtener" className="block text-sm font-medium text-white mb-1">
                Título a Obtener
              </label>
              <input
                type="text"
                id="tituloObtener"
                name="tituloObtener"
                value={carrera.tituloObtener}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-[#BFFF71]"
              />
            </div>

            <div>
              <label htmlFor="ubicacion" className="block text-sm font-medium text-white mb-1">
                Ubicación
              </label>
              <input
                type="text"
                id="ubicacion"
                name="ubicacion"
                value={carrera.ubicacion}
                onChange={handleChange}
                required
                placeholder="Ej: Centro de Comercio y Turismo - Quindío"
                className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-[#BFFF71] placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="visibleHasta" className="block text-sm font-medium text-white mb-1">
                Visible Hasta
              </label>
              <input
                type="date"
                id="visibleHasta"
                name="visibleHasta"
                value={carrera.visibleHasta}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-[#BFFF71]"
              />
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 text-black font-medium rounded-lg text-sm transition-colors
                  ${loading 
                    ? 'bg-[#BFFF71]/50 cursor-not-allowed' 
                    : 'bg-[#BFFF71] hover:bg-[#a6e85c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BFFF71]'
                  }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando...
                  </span>
                ) : 'Crear Carrera'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearCarrera;
