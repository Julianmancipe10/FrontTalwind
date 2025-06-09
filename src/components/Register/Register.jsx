import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../../Layouts/Header/Header';
import { registerUser } from '../../services/auth';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    documento: '',
    password: '',
    confirmPassword: '',
    rol: 'aprendiz'
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      const response = await registerUser(userData);
      
      if (response.requiresValidation) {
        setSuccessMessage(response.message);
        // Limpiar formulario pero no redirigir
        setFormData({
          nombre: '',
          apellido: '',
          correo: '',
          documento: '',
          password: '',
          confirmPassword: '',
          rol: 'aprendiz'
        });
      } else {
        // Para aprendices, redirigir al perfil
        navigate('/profile');
      }
    } catch (error) {
      setError(error.message || 'Error al registrar usuario');
    }
  };

  const getRoleDescription = (rol) => {
    const descriptions = {
      'aprendiz': 'Acceso a horarios, eventos y noticias del SENA',
      'instructor': 'Gestión de horarios y eventos (requiere validación administrativa)',
      'funcionario': 'Gestión administrativa completa (requiere validación administrativa)'
    };
    return descriptions[rol] || '';
  };

  return (
    <div className="min-h-screen bg-[#1a1f2e]">
      <div className="w-full">
        <Header />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-[#1e2536] rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row min-h-[700px]">
            {/* Sección de Bienvenida */}
            <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
              <h1 className="text-6xl font-bold text-white mb-6">
                BIENVENIDO
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Llega al SENA, la mejor plataforma de información
              </p>
              <Link 
                to="/about"
                className="w-32 bg-gradient-to-r from-yellow-400 to-teal-400 text-black font-semibold py-2 px-6 rounded-full hover:opacity-90 transition duration-300 text-center"
              >
                Leer más
              </Link>
            </div>

            {/* Sección del Formulario */}
            <div className="w-full md:w-1/2 p-12 bg-[#252b3b] rounded-l-3xl">
              <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-bold text-center text-white mb-8">
                  Registrarse
                </h2>

                {error && (
                  <div className="mb-4 p-4 bg-red-900/50 border-l-4 border-red-500 text-red-200">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 p-4 bg-green-900/50 border-l-4 border-green-500 text-green-200">
                    {successMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Ingresa tu nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[#1e2536] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      placeholder="Ingresa tu apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[#1e2536] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Correo electrónico</label>
                    <input
                      type="email"
                      name="correo"
                      placeholder="ejemplo@email.com"
                      value={formData.correo}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[#1e2536] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Documento de identidad</label>
                    <input
                      type="text"
                      name="documento"
                      placeholder="Ingresa tu número de documento"
                      value={formData.documento}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[#1e2536] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Rol</label>
                    <select
                      name="rol"
                      value={formData.rol}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[#1e2536] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    >
                      <option value="aprendiz">Aprendiz</option>
                      <option value="instructor">Instructor</option>
                      <option value="funcionario">Funcionario</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-1">
                      {getRoleDescription(formData.rol)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Ingresa una contraseña segura"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[#1e2536] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Confirmar contraseña</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirma tu contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[#1e2536] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-400 to-teal-400 text-black font-bold py-3 px-4 rounded-lg transition duration-300 hover:opacity-90 mt-6"
                  >
                    Registrarse
                  </button>

                  <p className="text-center text-gray-400 mt-6">
                    ¿Ya tienes cuenta?{" "}
                    <Link
                      to="/LoginPage"
                      className="text-teal-400 hover:text-teal-300 font-semibold transition duration-300"
                    >
                      Iniciar sesión
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
