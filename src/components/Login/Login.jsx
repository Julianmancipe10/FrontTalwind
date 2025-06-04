import React, { useState } from "react";
import { Header } from '../../Layouts/Header/Header';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/auth';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await loginUser({
        correo: formData.correo,
        password: formData.password
      });
      navigate('/');
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full">
        <Header />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-6xl bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row min-h-[500px]">
            {/* Sección de Bienvenida */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                BIENVENIDO
              </h1>
              <p className="text-gray-300 text-lg">
                Llega al SENA, la mejor plataforma de información
              </p>
              <button className="bg-gradient-to-r from-yellow-400 to-teal-400 hover:from-teal-400 hover:to-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 w-fit">
                Leer más
              </button>
            </div>

            {/* Sección del Formulario */}
            <div className="w-full md:w-1/2 p-8 backdrop-blur-lg bg-white/10 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full space-y-8">
                <h2 className="text-3xl font-bold text-center text-white">
                  Inicia sesión
                </h2>

                {error && (
                  <div className="bg-red-500/20 text-red-100 p-3 rounded-lg text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <input
                    type="email"
                    name="correo"
                    placeholder="Correo electrónico"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-gray-300/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-gray-300/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                  />

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-400 to-teal-400 hover:from-teal-400 hover:to-yellow-400 text-gray-900 font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Iniciar sesión
                  </button>

                  <p className="text-center text-gray-300">
                    ¿No tienes cuenta?{" "}
                    <Link
                      to="/register"
                      className="text-teal-400 hover:text-teal-300 font-medium transition-colors duration-300"
                    >
                      Registrarse
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

export default Login;
