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
    enlace: '',
    imagen: null,
    imagenId: ''
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
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
    const { name, value, files } = e.target;
    
    if (name === 'imagen' && files && files[0]) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      setSelectedFile(file);
      setShowPreview(true);
      setSelectedFileName(file.name);
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleAcceptImage = () => {
    if (previewUrl && selectedFile) {
      const imagenId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setFormData(prevState => ({
        ...prevState,
        imagen: selectedFile,
        imagenId: imagenId
      }));
      setShowPreview(false);
    }
  };

  const handleCancelImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    setShowPreview(false);
    setSelectedFileName('');
    setFormData(prevState => ({
      ...prevState,
      imagen: null,
      imagenId: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar que hay una imagen seleccionada y aceptada
    if (!formData.imagen) {
      alert('Por favor selecciona y acepta una imagen antes de crear la noticia.');
      return;
    }
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('fecha', formData.fecha);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('ubicacion', formData.ubicacion);
      formDataToSend.append('enlace', formData.enlace);
      formDataToSend.append('imagen', formData.imagen); // Archivo real

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
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setFormData({
          titulo: '',
          fecha: '',
          descripcion: '',
          ubicacion: '',
          enlace: '',
          imagen: null,
          imagenId: ''
        });
        setPreviewUrl(null);
        setSelectedFile(null);
        setShowPreview(false);
        setSelectedFileName('');
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
            <div className="space-y-4">
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-white mb-1">
                  Título *
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
                  Fecha de la Noticia *
                </label>
                <input 
                  type="date" 
                  id="fecha" 
                  name="fecha" 
                  value={formData.fecha} 
                  onChange={handleChange} 
                  required 
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-[#BFFF71]"
                />
              </div>
              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-white mb-1">
                  Descripción (opcional)
                </label>
                <textarea 
                  id="descripcion" 
                  name="descripcion" 
                  value={formData.descripcion} 
                  onChange={handleChange} 
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-[#BFFF71]"
                />
              </div>
              <div>
                <label htmlFor="ubicacion" className="block text-sm font-medium text-white mb-1">
                  Ubicación *
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
                  placeholder="https://ejemplo.com"
                  className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-[#BFFF71] placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Imagen *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                  <div className="space-y-1 text-center">
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      id="imagen" 
                      name="imagen" 
                      onChange={handleChange} 
                      accept="image/*"
                      required 
                      className="hidden"
                    />
                    <div className="flex flex-col items-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="mt-2 inline-flex items-center px-4 py-2 border border-gray-500 rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-[#BFFF71] hover:text-black transition-all duration-300"
                      >
                        {selectedFileName ? "Cambiar archivo" : "Seleccionar archivo"}
                      </button>
                      {selectedFileName && (
                        <p className="mt-2 text-sm text-gray-300">{selectedFileName}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {showPreview && previewUrl && (
                <div className="mt-4 space-y-4">
                  <div className="relative rounded-lg overflow-hidden">
                    <img src={previewUrl} alt="Vista previa" className="w-full h-64 object-cover"/>
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center space-x-4">
                      <button
                        type="button"
                        onClick={handleAcceptImage}
                        className="px-4 py-2 bg-[#BFFF71] text-black rounded-md hover:bg-[#a6e85c] font-medium transition-colors duration-300"
                      >
                        Aceptar
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelImage}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors duration-300"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {formData.imagenId && !showPreview && (
                <div className="mt-2 p-3 bg-[#BFFF71]/20 border border-[#BFFF71] rounded-lg">
                  <p className="text-sm text-[#BFFF71] font-medium">
                    ✅ Imagen aceptada: {formData.imagen?.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    ID: {formData.imagenId}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, imagen: null, imagenId: '' }));
                      setSelectedFile(null);
                    }}
                    className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
                  >
                    Cambiar imagen
                  </button>
                </div>
              )}
            </div>
            <div className="pt-5">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-[#BFFF71] hover:bg-[#a6e85c] transition-colors duration-300"
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
