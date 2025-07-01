import React, { useState, useEffect } from 'react';
import { updateMiPerfil } from '../services/instructorService';
import { getImageUrl } from '../services/config';

const EditarPerfilModal = ({ instructor, onClose, onPerfilActualizado }) => {
  const [formData, setFormData] = useState({
    especialidad: '',
    experiencia: '',
    cursos: [],
    biografia: ''
  });
  const [cursosInput, setCursosInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar datos del instructor al montar el componente
  useEffect(() => {
    if (instructor) {
      setFormData({
        especialidad: instructor.especialidad || '',
        experiencia: instructor.experiencia || '',
        cursos: instructor.cursos || [],
        biografia: instructor.biografia || ''
      });
      
      // Convertir array de cursos a string separado por comas
      if (instructor.cursos && Array.isArray(instructor.cursos)) {
        setCursosInput(instructor.cursos.join(', '));
      }
    }
  }, [instructor]);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en el campo de cursos
  const handleCursosChange = (e) => {
    const value = e.target.value;
    setCursosInput(value);
    
    // Convertir string separado por comas a array
    const cursosArray = value
      .split(',')
      .map(curso => curso.trim())
      .filter(curso => curso.length > 0);
    
    setFormData(prev => ({
      ...prev,
      cursos: cursosArray
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!formData.especialidad.trim()) {
      setError('La especialidad es requerida');
      return;
    }

    if (!formData.experiencia.trim()) {
      setError('La experiencia es requerida');
      return;
    }

    try {
      setLoading(true);
      await updateMiPerfil(formData);
      setSuccess('Perfil actualizado exitosamente');
      
      // Notificar al componente padre y cerrar después de 1.5 segundos
      setTimeout(() => {
        onPerfilActualizado();
      }, 1500);
    } catch (error) {
      setError(error.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#23293B] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#2D3446] shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              Editar Mi Perfil
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
              disabled={loading}
            >
              ×
            </button>
          </div>

          {/* Información del usuario */}
          {console.log('Valor de instructor.foto:', instructor.foto)}
          <div className="mb-6 p-4 bg-[#23293B] rounded-lg border border-[#2D3446]">
            {instructor.foto ? (
              <div className="flex justify-center mb-4">
                <img
                  src={getImageUrl(instructor.foto)}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#22D47C] shadow"
                  onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
                />
              </div>
            ) : (
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full border-4 border-[#22D47C] flex items-center justify-center text-[#22D47C] bg-[#23293B]">
                  Sin foto
                </div>
              </div>
            )}
            <p className="text-white">
              <strong>Nombre:</strong> {instructor.nombre} {instructor.apellido}
            </p>
            <p className="text-[#B0B8C1]">
              <strong>Rol:</strong> {instructor.rol === 'instructor' ? 'Instructor' : 'Funcionario'}
            </p>
            <p className="text-[#B0B8C1]">
              <strong>Email:</strong> {instructor.correo}
            </p>
          </div>

          {/* Mensajes */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Especialidad */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#B0B8C1] mb-2">
                Especialidad *
              </label>
              <input
                type="text"
                name="especialidad"
                value={formData.especialidad}
                onChange={handleInputChange}
                placeholder="Ej: Desarrollo Web Frontend, Gestión de Proyectos, etc."
                className="w-full px-3 py-2 bg-[#23293B] border border-[#2D3446] rounded-md focus:outline-none focus:ring-2 focus:ring-[#22D47C] text-white placeholder-[#B0B8C1]"
                disabled={loading}
                required
              />
            </div>

            {/* Experiencia */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#B0B8C1] mb-2">
                Experiencia *
              </label>
              <textarea
                name="experiencia"
                value={formData.experiencia}
                onChange={handleInputChange}
                placeholder="Describe tu experiencia profesional y educativa..."
                rows={4}
                className="w-full px-3 py-2 bg-[#23293B] border border-[#2D3446] rounded-md focus:outline-none focus:ring-2 focus:ring-[#22D47C] text-white placeholder-[#B0B8C1]"
                disabled={loading}
                required
              />
            </div>

            {/* Cursos */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#B0B8C1] mb-2">
                Cursos que enseñas
              </label>
              <input
                type="text"
                value={cursosInput}
                onChange={handleCursosChange}
                placeholder="Separa los cursos con comas: React JS, Python, Node.js, etc."
                className="w-full px-3 py-2 bg-[#23293B] border border-[#2D3446] rounded-md focus:outline-none focus:ring-2 focus:ring-[#22D47C] text-white placeholder-[#B0B8C1]"
                disabled={loading}
              />
              <p className="text-sm text-[#B0B8C1] mt-1">
                Separa múltiples cursos con comas
              </p>
              {/* Mostrar cursos como tags */}
              {formData.cursos.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.cursos.map((curso, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#22D47C]/20 text-[#22D47C] text-sm rounded-full border border-[#22D47C]"
                    >
                      {curso}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Biografía */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#B0B8C1] mb-2">
                Biografía
              </label>
              <textarea
                name="biografia"
                value={formData.biografia}
                onChange={handleInputChange}
                placeholder="Cuéntanos un poco sobre ti, tus pasiones, metodología de enseñanza, etc."
                rows={4}
                className="w-full px-3 py-2 bg-[#23293B] border border-[#2D3446] rounded-md focus:outline-none focus:ring-2 focus:ring-[#22D47C] text-white placeholder-[#B0B8C1]"
                disabled={loading}
              />
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-[#2D3446] text-[#B0B8C1] rounded-md hover:bg-[#23293B]/70 disabled:bg-[#23293B]/40 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !formData.especialidad.trim() || !formData.experiencia.trim()}
                className="flex-1 px-4 py-2 bg-[#22D47C] text-[#23293B] font-bold rounded-md hover:bg-[#1bb86a] disabled:bg-[#2D3446] disabled:text-[#B0B8C1] disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarPerfilModal; 