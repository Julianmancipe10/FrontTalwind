import React, { useState, useRef } from 'react';

const CrearEvento = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    fecha: '',
    descripcion: '',
    enlace: '',
    imagen: null,
    imagenId: ''
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'imagen' && files && files[0]) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
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
    if (previewUrl) {
      const imagenId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setFormData(prevState => ({
        ...prevState,
        imagen: previewUrl,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('handleSubmit reached');
    const formDataToSend = new FormData();
    formDataToSend.append('titulo', formData.titulo);
    formDataToSend.append('fecha', formData.fecha);
    formDataToSend.append('descripcion', formData.descripcion);
    formDataToSend.append('enlace', formData.enlace);
    formDataToSend.append('imagen', formData.imagen);
    formDataToSend.append('imagenId', formData.imagenId);

    console.log('Datos del evento a crear:', formData);
    alert('Evento creado (simulado): ' + formData.titulo);
    
    console.log('Clearing form');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setFormData({
      titulo: '',
      fecha: '',
      descripcion: '',
      enlace: '',
      imagen: null,
      imagenId: ''
    });
    setPreviewUrl(null);
    setShowPreview(false);
    setSelectedFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-6 sm:p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Crear Nuevo Evento</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                Título *
              </label>
              <input 
                type="text" 
                id="titulo" 
                name="titulo" 
                value={formData.titulo} 
                onChange={handleChange} 
                required 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
                Fecha del Evento *
              </label>
              <input 
                type="date" 
                id="fecha" 
                name="fecha" 
                value={formData.fecha} 
                onChange={handleChange} 
                required 
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                Descripción (opcional)
              </label>
              <textarea 
                id="descripcion" 
                name="descripcion" 
                value={formData.descripcion} 
                onChange={handleChange} 
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="enlace" className="block text-sm font-medium text-gray-700">
                Enlace (opcional)
              </label>
              <input 
                type="url" 
                id="enlace" 
                name="enlace" 
                value={formData.enlace} 
                onChange={handleChange} 
                placeholder="https://ejemplo.com"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Imagen *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                      className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {selectedFileName ? "Cambiar archivo" : "Seleccionar archivo"}
                    </button>
                    {selectedFileName && (
                      <p className="mt-2 text-sm text-gray-500">{selectedFileName}</p>
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
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Aceptar
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelImage}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {formData.imagenId && !showPreview && (
              <p className="mt-2 text-sm text-gray-500">
                ID de la imagen: {formData.imagenId}
              </p>
            )}
          </div>

          <div className="pt-5">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Crear Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearEvento;
