import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/auth';
import { updateUserProfile } from '../../services/profile';
import defaultProfileImage from '../../assets/images/default-profile.svg';
import { Header } from '../../Layouts/Header/Header';
import './Profile.css';

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
        setUser(userData);
        setFormData({
          nombre: userData.nombre || '',
          apellido: userData.apellido || '',
          correo: userData.correo || '',
          documento: userData.documento || '',
          password: '',
          confirmPassword: ''
        });
        setImagePreview(userData.foto || defaultProfileImage);
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
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('apellido', formData.apellido);
      formDataToSend.append('correo', formData.correo);
      formDataToSend.append('documento', formData.documento);
      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }
      if (selectedFile) {
        formDataToSend.append('imagen', selectedFile);
      }

      const updatedUser = await updateUserProfile(formDataToSend);
      setSuccess('Perfil actualizado exitosamente');
      setUser(updatedUser.user);
      
      // Actualizar el usuario en localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        ...updatedUser.user
      }));
    } catch (error) {
      setError(error.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-container">
        <div className="profile-card">
          <h2>Mi Perfil</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-info">
              <div className="profile-avatar">
                <img 
                  src={imagePreview} 
                  alt="Foto de perfil" 
                  className="avatar-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultProfileImage;
                  }}
                />
                <div className="avatar-upload">
                  <label htmlFor="image-upload" className="upload-button">
                    Cambiar foto
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              <div className="profile-details">
                <div className="detail-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="detail-group">
                  <label htmlFor="apellido">Apellido</label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="detail-group">
                  <label htmlFor="correo">Correo electrónico</label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="detail-group">
                  <label htmlFor="documento">Documento</label>
                  <input
                    type="text"
                    id="documento"
                    name="documento"
                    value={formData.documento}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="detail-group">
                  <label htmlFor="password">Nueva contraseña (opcional)</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="detail-group">
                  <label htmlFor="confirmPassword">Confirmar contraseña</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="profile-actions">
              <button 
                type="submit" 
                className="save-button"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile; 