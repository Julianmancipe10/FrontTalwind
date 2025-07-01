import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../../Layouts/Header/Header';
import { getPublicacionById, updatePublicacion } from '../../../services/publicaciones';
import PermissionWrapper from "../../../components/PermissionWrapper/PermissionWrapper";
import { PERMISOS } from "../../../constants/roles";
import { API_CONFIG, getImageUrl } from '../../../services/config';
import slider1 from '../../../assets/images/optimized/optimized_slider1.jpg';

const VerMasNoticia = () => {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [newImage, setNewImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        setLoading(true);
        const data = await getPublicacionById(id);
        
        if (data) {
          // Construir URL de imagen usando el helper universal
          const imageUrl = data.ImagenSlider ? getImageUrl(data.ImagenSlider) : slider1;
            
          setNoticia({
            id: data.ID_Evento,
            titulo: data.Nombre,
            fecha: data.Fecha,
            enlace: data.URL_Enlace,
            imagen: imageUrl,
            descripcion: data.Descripción,
            ubicacion: data.Ubicacion,
            creador: `${data.CreadorNombre || ''} ${data.CreadorApellido || ''}`.trim(),
            fechaCreacion: data.FechaCreacion
          });
          
          setEditForm({
            titulo: data.Nombre,
            descripcion: data.Descripción,
            enlace: data.URL_Enlace || '',
            ubicacion: data.Ubicacion
          });
        } else {
          setError('Noticia no encontrada');
        }
      } catch (error) {
        console.error('Error al cargar noticia:', error);
        setError('Error al cargar la noticia');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNoticia();
    }
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveEdit = async () => {
    try {
      // Preparar datos para actualización
      const formData = new FormData();
      formData.append('Nombre', editForm.titulo);
      formData.append('Descripción', editForm.descripcion);
      formData.append('URL_Enlace', editForm.enlace);
      formData.append('Ubicacion', editForm.ubicacion);
      
      if (newImage) {
        formData.append('imagen', newImage);
      }

      // Usar el servicio centralizado
      await updatePublicacion(id, formData);

      // Actualizar estado local
      setNoticia({
        ...noticia,
        titulo: editForm.titulo,
        descripcion: editForm.descripcion,
        enlace: editForm.enlace,
        ubicacion: editForm.ubicacion,
        imagen: newImagePreview || noticia.imagen
      });
      
      setIsEditing(false);
      setNewImage(null);
      if (newImagePreview) {
        URL.revokeObjectURL(newImagePreview);
      }
      setNewImagePreview(null);
      alert('✅ Noticia actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar noticia:', error);
      alert(`❌ Error al actualizar noticia: ${error.message}`);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#BFFF71] mx-auto mb-4"></div>
        <p className="text-white text-xl">Cargando noticia...</p>
      </div>
    </div>
  );

  if (error || !noticia) return (
    <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl text-red-400 mb-4">{error || "Noticia no encontrada"}</p>
        <button 
          onClick={() => window.history.back()}
          className="bg-[#BFFF71] text-black px-6 py-2 rounded-lg hover:bg-[#a6e85c] transition-colors"
        >
          Volver
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1f2e] font-['Poppins'] pb-10 pt-8">
      <Header />
      
      <h2 className="text-5xl font-bold text-[#BFFF71] text-center mt-24 mb-2 uppercase">
        Noticias
      </h2>
      
      <div className="max-w-[90%] lg:max-w-[80%] xl:max-w-[60%] mx-auto mt-6 bg-[#1b1b1b] rounded-2xl shadow-2xl p-6 space-y-4">
        
        {/* Botones de acción */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          
          <PermissionWrapper requiredPermissions={[PERMISOS.EDITAR_PUBLICACION]}>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveEdit}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar
                </button>
              </div>
            )}
          </PermissionWrapper>
        </div>

        {/* Contenido principal */}
        <div className="space-y-2">
          {isEditing ? (
            <input
              type="text"
              value={editForm.titulo}
              onChange={(e) => setEditForm({...editForm, titulo: e.target.value})}
              className="w-full text-3xl md:text-4xl font-bold text-[#BFFF71] bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:border-[#BFFF71] focus:outline-none"
            />
          ) : (
            <h1 className="text-3xl md:text-4xl font-bold text-[#BFFF71]">
              {noticia.titulo}
            </h1>
          )}
          
          <p className="text-lg text-gray-400">
            📅 {new Date(noticia.fecha).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>

          <p className="text-gray-300 text-sm">
            📍 {noticia.ubicacion}
          </p>

          {noticia.creador && (
            <p className="text-gray-400 text-sm">
              👤 Creado por: {noticia.creador}
            </p>
          )}
          
          {noticia.enlace && (
            <div>
              {isEditing ? (
                <input
                  type="url"
                  value={editForm.enlace}
                  onChange={(e) => setEditForm({...editForm, enlace: e.target.value})}
                  placeholder="https://..."
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#BFFF71] focus:outline-none"
                />
              ) : (
                <a 
                  href={noticia.enlace} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-[#BFFF71] text-[#232323] px-6 py-2 rounded-lg font-medium hover:bg-[#a6e85c] transition-colors duration-200"
                >
                  🔗 Ver Enlace
                </a>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-4">
          <div className="lg:w-3/5">
            <div className="rounded-xl overflow-hidden bg-[#111111] relative">
              <img 
                src={newImagePreview || noticia.imagen} 
                alt={noticia.titulo}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = slider1;
                }}
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <label className="cursor-pointer bg-[#BFFF71] text-black px-4 py-2 rounded-lg hover:bg-[#a6e85c] transition-colors">
                    📷 Cambiar Imagen
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:w-2/5 space-y-4">
            <div className="bg-[#252525] p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-[#BFFF71] mb-4">
                Descripción
              </h3>
              {isEditing ? (
                <textarea
                  value={editForm.descripcion}
                  onChange={(e) => setEditForm({...editForm, descripcion: e.target.value})}
                  rows={8}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#BFFF71] focus:outline-none resize-none"
                />
              ) : (
                <p className="text-gray-300 leading-relaxed">
                  {noticia.descripcion}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerMasNoticia;
