import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../../Layouts/Header/Header';
import { registerUser } from '../../services/auth';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    documento: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      const response = await registerUser(userData);
      
      navigate('/profile');
    } catch (error) {
      setError(error.message || 'Error al registrar usuario');
    }
  };

  return (
    <div className="divmayor">
      <div className="HeaderDiseñoRegistro">
        <Header />
      </div>

      <div className="divPrincipal">
        {/* Sección de Bienvenida */}
        <div className="bienvenida">
          <h1 className="txt-Bienvenido">BIENVENIDO</h1>
          <p className="parrafoBienvenido">
            Únete a la mejor plataforma de información del SENA
          </p>
        </div>

        {/* Sección del Formulario */}
        <div className="Registro">
          <h2 className="txt-registrarse">Registrarse</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="mi-formulario">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="input-field"
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              className="input-field"
            />
            <input
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              value={formData.correo}
              onChange={handleChange}
              required
              className="input-field"
            />
            <input
              type="text"
              name="documento"
              placeholder="Número de documento"
              value={formData.documento}
              onChange={handleChange}
              required
              className="input-field"
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="input-field"
            />

            <button type="submit" className="btn-Registrarse">
              Registrarse
            </button>

            <p className="login-text">
              ¿Ya tienes cuenta?{" "}
              <Link to="/LoginPage" style={{ color: "blue" }}>
                Iniciar sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
