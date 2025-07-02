import React, { useState, useRef, useEffect } from 'react';
import { usePermissions } from '../../../hooks/usePermissions';
import { PERMISOS } from '../../../constants/roles';
import AccessDenied from '../../../components/AccessDenied/AccessDenied';
import { Header } from '../../../Layouts/Header/Header';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../../../services/config';

const CrearNoticia = () => {
  // TODOS los hooks deben ir PRIMERO
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    fecha: '',
    descripcion: '',
    ubicacion: '',
    imagen: null,
    enlace: '',
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Verificar permisos DESPUÉS de todos los hooks
  if (!hasPermission(PERMISOS.CREAR_NOTICIA)) {
    return (
      <AccessDenied 
        message="No tienes permisos para crear noticias. Solo los instructores con permisos específicos pueden acceder a esta funcionalidad."
      />
    );
  }

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    if (name === 'imagen' && files && files[0]) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFormData(prev => ({ ...prev, imagen: files[0] }));
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFormData(prev => ({ ...prev, imagen: null }));
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imagen) {
      alert('Por favor selecciona una imagen para la noticia.');
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('fecha', formData.fecha);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('ubicacion', formData.ubicacion);
      if (formData.enlace) {
        formDataToSend.append('enlace', formData.enlace);
      }
      formDataToSend.append('imagenes', formData.imagen);
      const response = await fetch(buildApiUrl('/publicaciones/noticias'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });
      const result = await response.json();
      if (response.ok) {
        alert(`✅ ¡Noticia creada exitosamente!\nTítulo: ${result.noticia.titulo}\nID: ${result.noticia.id}`);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setFormData({
          titulo: '',
          fecha: '',
          descripcion: '',
          ubicacion: '',
          imagen: null,
          enlace: '',
        });
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        alert(`❌ Error al crear noticia: ${result.message}`);
        console.error('Error del servidor:', result);
      }
    } catch (error) {
      console.error('Error al enviar noticia:', error);
      alert('❌ Error de conexión. Verifica que el servidor esté funcionando.');
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
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Crear Nueva Noticia</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-white mb-1">
                Título*
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-[#BFFF71]"
              />
            </div>

            <div>
              <label htmlFor="fecha" className="block text-sm font-medium text-white mb-1">
                Fecha de la noticia*
              </label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-[#BFFF71]"
              />
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-white mb-1">
                Descripción (Opcional)
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-[#BFFF71]"
              />
            </div>

            <div>
              <label htmlFor="ubicacion" className="block text-sm font-medium text-white mb-1">
                Ubicación*
              </label>
              <input
                type="text"
                id="ubicacion"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                required
                placeholder="Ej: Centro de Comercio y Turismo - Quindío"
                className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-[#BFFF71] placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="enlace" className="block text-sm font-medium text-white mb-1">
                Enlace (opcional)
              </label>
              <input
                type="url"
                id="enlace"
                name="enlace"
                value={formData.enlace}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-[#BFFF71] placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Imágenes (hasta 4)*
              </label>
              <input
                ref={fileInputRef}
                type="file"
                id="imagen"
                name="imagen"
                onChange={handleChange}
                accept="image/*"
                className="hidden"
              />

              {previewUrl && (
                <div className="mt-4 space-y-4">
                  <h4 className="text-sm font-medium text-white">Imagen seleccionada:</h4>
                  <div className="relative rounded-lg overflow-hidden h-24 border border-gray-600">
                    <img
                      src={previewUrl}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors duration-300"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-5">
              <button
                type="submit"
                className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-black bg-[#BFFF71] hover:bg-[#a6e85c] transition-colors duration-300"
              >
                Crear Noticia
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearNoticia;
