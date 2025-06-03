import React, { useState, useEffect } from 'react';
import { Header } from '../../Layouts/Header/Header';
import '../CrearPerfil/ProfileUser.css';
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
    <div className='fondo-Profile'>
      <Header />

      <div className="divPrincipal">
        <div className='profile-image'>
          {formData.avatar_url ? (
            <img src={formData.avatar_url} alt="perfil" />
          ) : (
            <div className='placeholder'>Agregar foto</div>
          )}
          <label className="boton-cargarimagen">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              disabled={loading}
            />
            Seleccionar imagen
          </label>
        </div>

        <form onSubmit={handleSubmit} className='profile-form'>
          <h2>Crear perfil</h2>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">¡Perfil actualizado exitosamente! Redirigiendo...</div>}

          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder='Nombre'
            required
            disabled={loading}
          />

          <label>Apellido</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder='Apellido'
            required
            disabled={loading}
          />

          <label>Correo</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder='Correo'
            required
            disabled={loading}
          />

          <button 
            type="submit" 
            className="btn-guardar"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar perfil'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileUser;
