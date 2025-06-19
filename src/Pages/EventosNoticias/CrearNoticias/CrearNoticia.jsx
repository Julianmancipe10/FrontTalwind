import React, { useState, useRef, useEffect } from 'react';
import { usePermissions } from '../../../hooks/usePermissions';
import { PERMISOS } from '../../../constants/roles';
import AccessDenied from '../../../components/AccessDenied/AccessDenied';
import { Header } from '../../../Layouts/Header/Header';
import { useNavigate } from 'react-router-dom';

const CrearNoticia = () => {
  // TODOS los hooks deben ir PRIMERO
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    fecha: '',
    descripcion: '',
    ubicacion: '',
    imagenes: [],
    enlace: '',
  });

  const [stagedImages, setStagedImages] = useState([]);
  const [selectedFileNames, setSelectedFileNames] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      formData.imagenes.forEach(img => URL.revokeObjectURL(img.previewUrl));
      stagedImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
    };
  }, [formData.imagenes, stagedImages]);

  // Verificar permisos DESPUÉS de todos los hooks
  if (!hasPermission(PERMISOS.CREAR_NOTICIA)) {
    return (
      <AccessDenied 
        message="No tienes permisos para crear noticias. Solo los instructores con permisos específicos pueden acceder a esta funcionalidad."
      />
    );
  }

  const handleChange = (e) => {
    const { name, files } = e.target;
    
    if (name === 'imagenes' && files) {
      const currentImagesCount = formData.imagenes.length + stagedImages.length;
      const filesToProcess = Array.from(files).slice(0, 4 - currentImagesCount);

      const newStagedImages = filesToProcess.map(file => ({
        file: file,
        previewUrl: URL.createObjectURL(file),
      }));

      setStagedImages(prevStaged => [...prevStaged, ...newStagedImages]);
    } else {
      const { value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAcceptStagedImages = () => {
    setFormData(prevState => ({
      ...prevState,
      imagenes: [...prevState.imagenes, ...stagedImages]
    }));
    setStagedImages([]);
  };

  const handleCancelStagedImages = () => {
    stagedImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setStagedImages([]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prevState => {
      const imageToRemove = prevState.imagenes[indexToRemove];
      URL.revokeObjectURL(imageToRemove.previewUrl);
      const newImages = prevState.imagenes.filter((_, index) => index !== indexToRemove);
      return {
        ...prevState,
        imagenes: newImages
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(stagedImages.length > 0) {
      alert('Por favor acepta las imágenes seleccionadas antes de crear la noticia.');
      return;
    }

    // Verificar que hay al menos una imagen
    if(formData.imagenes.length === 0) {
      alert('Por favor selecciona al menos una imagen para la noticia.');
      return;
    }

    try {
      console.log('Enviando noticia al backend...');
      
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('fecha', formData.fecha);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('ubicacion', formData.ubicacion);
      
      if (formData.enlace) {
        formDataToSend.append('enlace', formData.enlace);
      }
      
      // Agregar todas las imágenes
      formData.imagenes.forEach((img, index) => {
        formDataToSend.append('imagenes', img.file);
      });

      const response = await fetch('http://localhost:5000/api/publicaciones/noticias', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ ¡Noticia creada exitosamente!\nTítulo: ${result.noticia.titulo}\nID: ${result.noticia.id}\nImágenes: ${result.noticia.imagenes.length}`);
        
        console.log('Noticia creada:', result.noticia);
        
        // Limpiar formulario después del éxito
        formData.imagenes.forEach(img => URL.revokeObjectURL(img.previewUrl));
        setFormData({
          titulo: '',
          fecha: '',
          descripcion: '',
          ubicacion: '',
          imagenes: [],
          enlace: '',
        });
        setSelectedFileNames([]);
        setStagedImages([]);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
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
                id="imagenes"
                name="imagenes"
                onChange={handleChange}
                accept="image/*"
                multiple
                disabled={formData.imagenes.length + stagedImages.length >= 4}
                className="hidden"
              />

              {stagedImages.length === 0 && (
                <div
                  onClick={() => formData.imagenes.length + stagedImages.length < 4 && fileInputRef.current.click()}
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-[#BFFF71] transition-colors bg-gray-700 hover:bg-gray-600 ${
                    formData.imagenes.length + stagedImages.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-300">
                      <span className="relative rounded-md font-medium text-[#BFFF71] hover:text-[#a6e85c] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#BFFF71]">
                        {formData.imagenes.length > 0
                          ? `Archivo(s) Seleccionado(s) (${formData.imagenes.length})`
                          : "Seleccionar archivo(s)"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF hasta 10MB</p>
                  </div>
                </div>
              )}

              {stagedImages.length > 0 && (
                <div className="mt-4 space-y-4">
                  <h4 className="text-sm font-medium text-white">Imágenes para agregar:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {stagedImages.map((image, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden h-24 border border-gray-600">
                        <img
                          src={image.previewUrl}
                          alt={`Vista previa ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleAcceptStagedImages}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-black bg-[#BFFF71] hover:bg-[#a6e85c] transition-colors duration-300"
                    >
                      Aceptar Selección
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelStagedImages}
                      className="inline-flex justify-center py-2 px-4 border border-gray-500 shadow-sm text-sm font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-500 transition-colors duration-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {formData.imagenes.length > 0 && stagedImages.length === 0 && (
                <div className="mt-4 space-y-4">
                  <h4 className="text-sm font-medium text-white">Imágenes cargadas:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {formData.imagenes.map((image, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden h-24 border border-gray-600">
                        <img
                          src={image.previewUrl}
                          alt={`Imagen cargada ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors duration-300"
                        >
                          ×
                        </button>
                      </div>
                    ))}
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
