import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/auth';
import { updateUserProfile, updateUserProfileJSON } from '../../services/profile';
import defaultProfileImage from '../../assets/images/default-profile.svg';
import { Header } from '../../Layouts/Header/Header';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    documento: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(defaultProfileImage);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = getCurrentUser();
        if (!userData) {
          navigate('/LoginPage');
          return;
        }
        
        // Cargar datos frescos del servidor
        try {
          const response = await fetch('http://localhost:5000/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (response.ok) {
            const profileData = await response.json();
            setUser(profileData);
            setFormData({
              nombre: profileData.nombre || '',
              apellido: profileData.apellido || '',
              correo: profileData.correo || '',
              documento: profileData.documento || '',
              password: '',
              confirmPassword: ''
            });
            
            // Cargar imagen de perfil
            if (profileData.foto) {
              setImagePreview(`http://localhost:5000${profileData.foto}`);
            } else {
              setImagePreview(defaultProfileImage);
            }
          } else {
            // Si falla cargar del servidor, usar datos de localStorage
            setUser(userData);
            setFormData({
              nombre: userData.nombre || '',
              apellido: userData.apellido || '',
              correo: userData.correo || '',
              documento: userData.documento || '',
              password: '',
              confirmPassword: ''
            });
            setImagePreview(defaultProfileImage);
          }
        } catch (serverError) {
          console.error('Error al cargar perfil del servidor:', serverError);
          // Fallback a localStorage si hay error de servidor
          setUser(userData);
          setFormData({
            nombre: userData.nombre || '',
            apellido: userData.apellido || '',
            correo: userData.correo || '',
            documento: userData.documento || '',
            password: '',
            confirmPassword: ''
          });
          setImagePreview(defaultProfileImage);
        }
      } catch (error) {
        setError('Error al cargar los datos del usuario');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      let updatedUser;

      // Si hay una imagen seleccionada, usar FormData
      if (selectedFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('nombre', formData.nombre);
        formDataToSend.append('apellido', formData.apellido);
        formDataToSend.append('correo', formData.correo);
        formDataToSend.append('documento', formData.documento);
        if (formData.password) {
          formDataToSend.append('password', formData.password);
        }
        formDataToSend.append('profileImage', selectedFile);

        updatedUser = await updateUserProfile(formDataToSend);
      } else {
        // Si no hay imagen, usar JSON
        const dataToSend = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          correo: formData.correo,
          documento: formData.documento
        };

        if (formData.password) {
          dataToSend.password = formData.password;
        }

        updatedUser = await updateUserProfileJSON(dataToSend);
      }

      setSuccess('Perfil actualizado exitosamente');
      setUser(updatedUser.user);
      
      // Actualizar el usuario en localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        ...updatedUser.user
      }));

      // Actualizar la imagen del perfil si se recibió una nueva
      if (updatedUser.user.foto) {
        setImagePreview(`http://localhost:5000${updatedUser.user.foto}`);
      }

      // Limpiar la imagen seleccionada después de actualizar exitosamente
      setSelectedFile(null);
    } catch (error) {
      setError(error.message || 'Error al actualizar el perfil');
      console.error('❌ Error en handleSubmit:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center">
        <div className="animate-pulse flex items-center space-x-3">
          <div className="w-4 h-4 bg-[#BFFF71] rounded-full"></div>
          <div className="w-4 h-4 bg-[#BFFF71] rounded-full animation-delay-200"></div>
          <div className="w-4 h-4 bg-[#BFFF71] rounded-full animation-delay-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f2e]">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 mt-16 sm:mt-20">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado del perfil */}
          <div className="mb-6 sm:mb-8 text-center px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3">
              Gestión de Perfil
            </h1>
            <p className="text-base sm:text-lg text-gray-400">
              Actualiza y administra tu información personal
            </p>
          </div>

          {/* Contenedor principal */}
          <div className="bg-[#1e2536] rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
              {/* Sección lateral - Foto de perfil */}
              <div className="lg:col-span-4 bg-[#252b3b] p-6 sm:p-8 flex flex-col items-center justify-center relative order-1 lg:order-none">
                <div className="relative group">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden ring-4 ring-offset-4 sm:ring-offset-8 ring-offset-[#252b3b] ring-[#BFFF71] transition-all duration-300 group-hover:ring-offset-8 sm:group-hover:ring-offset-12">
                    <img 
                      src={imagePreview} 
                      alt="Foto de perfil" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultProfileImage;
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <label 
                      htmlFor="image-upload" 
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-400 to-teal-400 text-black font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all duration-300 cursor-pointer transform hover:scale-105 backdrop-blur-sm text-sm sm:text-base"
                    >
                      Cambiar foto
                    </label>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <div className="mt-4 sm:mt-6 text-center">
                  <h2 className="text-xl sm:text-2xl font-semibold text-white mb-1 sm:mb-2">
                    {formData.nombre} {formData.apellido}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-400">{formData.correo}</p>
                </div>
              </div>

              {/* Sección principal - Formulario */}
              <div className="lg:col-span-8 p-6 sm:p-8 order-2 lg:order-none">
                <div className="max-w-3xl mx-auto">
                  {error && (
                    <div className="mb-6 p-3 sm:p-4 bg-red-900/30 border-l-4 border-red-500 text-red-200 rounded-lg flex items-center text-sm sm:text-base">
                      <svg className="w-5 h-5 mr-2 sm:mr-3 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="flex-1">{error}</span>
                    </div>
                  )}
                  
                  {success && (
                    <div className="mb-6 p-3 sm:p-4 bg-green-900/30 border-l-4 border-green-500 text-green-200 rounded-lg flex items-center text-sm sm:text-base">
                      <svg className="w-5 h-5 mr-2 sm:mr-3 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="flex-1">{success}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-1 sm:space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Nombre</label>
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-[#1a1f2e] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#BFFF71] focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          placeholder="Tu nombre"
                        />
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Apellido</label>
                        <input
                          type="text"
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-[#1a1f2e] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#BFFF71] focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          placeholder="Tu apellido"
                        />
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Correo electrónico</label>
                        <input
                          type="email"
                          name="correo"
                          value={formData.correo}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-[#1a1f2e] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#BFFF71] focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          placeholder="tu@email.com"
                        />
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Documento</label>
                        <input
                          type="text"
                          name="documento"
                          value={formData.documento}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-[#1a1f2e] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#BFFF71] focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          placeholder="Número de documento"
                        />
                      </div>
                    </div>

                    <div className="border-t border-gray-700 my-6 sm:my-8"></div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-1 sm:space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Nueva contraseña</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-[#1a1f2e] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#BFFF71] focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          placeholder="••••••••"
                        />
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Confirmar contraseña</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-[#1a1f2e] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#BFFF71] focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6 sm:pt-8">
                      <button 
                        type="button" 
                        onClick={() => navigate('/')}
                        disabled={loading}
                        className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-white bg-red-500/20 hover:bg-red-500/30 font-medium transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-400 to-teal-400 hover:from-teal-400 hover:to-yellow-400 text-black font-semibold rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center min-w-[140px] sm:min-w-[160px] text-sm sm:text-base"
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Guardando...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Guardar cambios
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 