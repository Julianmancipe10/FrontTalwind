import React, { useState } from 'react';
import { userService } from '../../services/userService';

const CreateUserForm = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    documento: '',
    password: '',
    rol: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario comience a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await userService.createUser(formData);
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        apellido: '',
        correo: '',
        documento: '',
        password: '',
        rol: ''
      });

      if (onSuccess) {
        onSuccess('Usuario creado exitosamente');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1e2536] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              <i className="fas fa-user-plus mr-3 text-[#39B54A]"></i>
              Crear Usuario
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Crea nuevos instructores y funcionarios del sistema
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-gray-700 rounded-lg"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-900/50 border border-red-600 text-red-300 px-4 py-3 rounded-lg flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          {/* Grid de campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-user mr-2"></i>
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-[#252b3b] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39B54A] focus:border-transparent transition-all duration-200"
                placeholder="Ingresa el nombre"
                disabled={loading}
              />
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-user mr-2"></i>
                Apellido *
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-[#252b3b] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39B54A] focus:border-transparent transition-all duration-200"
                placeholder="Ingresa el apellido"
                disabled={loading}
              />
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-envelope mr-2"></i>
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-[#252b3b] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39B54A] focus:border-transparent transition-all duration-200"
                placeholder="ejemplo@senaunity.edu.co"
                disabled={loading}
              />
            </div>

            {/* Documento */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-id-card mr-2"></i>
                Documento *
              </label>
              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={handleInputChange}
                required
                pattern="[0-9]+"
                className="w-full px-4 py-3 bg-[#252b3b] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39B54A] focus:border-transparent transition-all duration-200"
                placeholder="Solo números"
                disabled={loading}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-lock mr-2"></i>
                Contraseña *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                  className="w-full px-4 py-3 bg-[#252b3b] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39B54A] focus:border-transparent transition-all duration-200 pr-12"
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  disabled={loading}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-user-tag mr-2"></i>
                Rol *
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-[#252b3b] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#39B54A] focus:border-transparent transition-all duration-200"
                disabled={loading}
              >
                <option value="">Seleccionar rol</option>
                <option value="instructor">Instructor</option>
                <option value="funcionario">Funcionario</option>
              </select>
            </div>
          </div>

          {/* Info adicional */}
          <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
            <div className="flex items-start">
              <i className="fas fa-info-circle text-blue-400 mr-3 mt-1"></i>
              <div>
                <h4 className="text-blue-300 font-medium">Información importante</h4>
                <ul className="text-blue-200 text-sm mt-2 space-y-1">
                  <li>• Los usuarios creados estarán activos inmediatamente</li>
                  <li>• Solo se pueden crear instructores y funcionarios</li>
                  <li>• La contraseña debe tener al menos 6 caracteres</li>
                  <li>• El documento debe contener solo números</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium"
              disabled={loading}
            >
              <i className="fas fa-times mr-2"></i>
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-[#39B54A] hover:bg-[#2d8f37] text-white rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Creando...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus mr-2"></i>
                  Crear Usuario
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm; 