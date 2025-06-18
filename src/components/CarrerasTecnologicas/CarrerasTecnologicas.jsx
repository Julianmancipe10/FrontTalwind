import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../Layouts/Header/Header';
import PermissionWrapper from '../PermissionWrapper/PermissionWrapper';
import { PERMISOS } from '../../constants/roles';

const CarrerasTecnologicas = () => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [carreras, setCarreras] = useState([
    {
      id: 1,
      titulo: 'COCINA',
      tipo: 'Carrera técnica',
      horas: 2200,
      descripcion: 'Recibe y maneja materias primas...',
      tituloObtener: 'TÉCNICO EN COCINA',
      visibleHasta: '2024-12-31'
    }
  ]);

  const carrerasDisponibles = [
    {
      id: 2,
      titulo: 'DESARROLLO DE SOFTWARE',
      tipo: 'Carrera tecnológica',
      horas: 3600,
      descripcion: 'Aprende a desarrollar aplicaciones...',
      tituloObtener: 'TECNÓLOGO EN DESARROLLO DE SOFTWARE',
      visibleHasta: '2024-12-31'
    },
    // Más carreras pueden ser agregadas aquí
  ];

  const filtradas = carrerasDisponibles.filter(carrera =>
    carrera.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const estaAgregada = (id) => carreras.some(c => c.id === id);

  const agregarCarrera = (carrera) => {
    const yaExiste = carreras.some(c => c.id === carrera.id);
    if (!yaExiste) {
      setCarreras([...carreras, {
        ...carrera,
        descripcion: carrera.descripcion || 'Descripción temporal',
        tituloObtener: carrera.tituloObtener || `TÍTULO EN ${carrera.titulo.toUpperCase()}`,
        horas: carrera.horas || 1800,
        visibleHasta: carrera.visibleHasta || null
      }]);
    }
  };

  const eliminarCarrera = (id) => {
    setCarreras(carreras.filter(c => c.id !== id));
  };

  const irACrearCarrera = () => {
    navigate('/crear-carrera');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              ← Atrás
            </button>
            <h1 className="text-4xl font-bold text-white mb-4 sm:mb-0">
              Carreras Tecnológicas
            </h1>
          </div>
          <div className="flex gap-4">
            <PermissionWrapper requiredPermissions={[PERMISOS.CREAR_CARRERA]}>
              <button 
                onClick={irACrearCarrera}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Crear Nueva Carrera
              </button>
            </PermissionWrapper>
            <button 
              onClick={() => setMostrarModal(true)}
              className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Agregar Carrera
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carreras.map((carrera) => (
            <div key={carrera.id} className="bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <div className="bg-green-600 -mx-6 -mt-6 p-4 mb-6">
                  <h2 className="text-2xl font-semibold text-white">
                    {carrera.titulo}
                  </h2>
                  <p className="text-white text-sm mt-1">{carrera.tipo}</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-green-400">DURACIÓN:</h4>
                    <p className="text-white">{carrera.horas} horas</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-green-400">DESCRIPCIÓN:</h4>
                    <p className="text-white">{carrera.descripcion}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-green-400">TÍTULO A OBTENER:</h4>
                    <p className="text-white">{carrera.tituloObtener}</p>
                  </div>
                  {carrera.visibleHasta && (
                    <div className="pt-4 mt-4 border-t border-gray-700">
                      <p className="text-sm text-gray-400">
                        <span className="font-medium">Visible hasta:</span>{' '}
                        {new Date(carrera.visibleHasta).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Buscar Carrera
              </h2>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-green-500 mb-6 placeholder-gray-400"
              />

              <ul className="divide-y divide-gray-700">
                {filtradas.map((carrera) => (
                  <li key={carrera.id} className="py-4 flex justify-between items-center">
                    <span className="text-white">{carrera.titulo} - {carrera.tipo}</span>
                    {estaAgregada(carrera.id) ? (
                      <button 
                        onClick={() => eliminarCarrera(carrera.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                      >
                        Eliminar
                      </button>
                    ) : (
                      <button 
                        onClick={() => agregarCarrera(carrera)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                      >
                        Agregar
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <PermissionWrapper requiredPermissions={[PERMISOS.CREAR_CARRERA]}>
                  <button 
                    onClick={irACrearCarrera}
                    className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                  >
                    Crear Nueva Carrera
                  </button>
                </PermissionWrapper>
                <button 
                  onClick={() => setMostrarModal(false)}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarrerasTecnologicas;
