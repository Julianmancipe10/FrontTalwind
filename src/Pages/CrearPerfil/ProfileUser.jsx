import React, { useState, useEffect } from 'react';
import { Header } from '../../Layouts/Header/Header';
import { useNavigate } from 'react-router-dom';
import { getAuthHeader, getCurrentUser } from '../../services/auth';

const ProfileUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    avatar_url: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    // Cargar datos del perfil si existen
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            ...getAuthHeader()
          }
        });

        if (response.ok) {
          const data = await response.json();
          setFormData({
            nombre: data.nombre || "",
            apellido: data.apellido || "",
            correo: data.correo || "",
            avatar_url: data.avatar_url || null
          });
        }
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Limpiar errores cuando el usuario comienza a escribir
    if (error) setError('');
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("La imagen es muy pesada. Por favor usa una menor a 2 MB");
        return;
      }

      // Convertir la imagen a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevState) => ({
          ...prevState,
          avatar_url: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          correo: formData.correo,
          // avatar_url: formData.avatar_url // Si tu backend lo soporta
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al actualizar el perfil');
      }

      const data = await response.json();
      console.log('Perfil actualizado:', data);
      // Actualizar usuario en localStorage
      const user = JSON.parse(localStorage.getItem('user')) || {};
      user.nombre = data.user?.nombre || formData.nombre;
      user.apellido = data.user?.apellido || formData.apellido;
      user.correo = data.user?.correo || formData.correo;
      localStorage.setItem('user', JSON.stringify(user));
      setSuccess(true);
      
      // Esperar 2 segundos antes de redirigir
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative">
      <div className="absolute inset-0 bg-[url('../../assets/images/fondo_sena_unity.jpg')] bg-cover bg-center bg-no-repeat opacity-20"></div>
      
      <Header />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row gap-8">
          
          {/* Sección de imagen */}
          <div className="flex flex-col items-center space-y-4 md:w-1/3">
            <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-4 border-emerald-500/30">
              {formData.avatar_url ? (
                <img 
                  src={formData.avatar_url} 
                  alt="perfil" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-300">
                  Agregar foto
                </div>
              )}
            </div>
            <label className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg cursor-pointer hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={loading}
              />
              Seleccionar imagen
            </label>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-white text-center md:text-left mb-8">Crear perfil</h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
                ¡Perfil actualizado exitosamente! Redirigiendo...
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 bg-white/10 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Apellido"
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 bg-white/10 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="Correo"
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 bg-white/10 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar perfil'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
