import React, { useEffect, useState } from 'react'
import imgLogo from '../../assets/images/optimized/optimized_Logo_SenaUnity.png'
import imgLogoSenaGreen from '../../assets/images/optimized/optimized_logo-sena-green.png'
import imgUsuario from '../../assets/images/optimized/optimized_imgUsuario.png'
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISOS } from '../../constants/roles';
import { getCurrentUser, getPendingValidations } from '../../services/auth';

export const Header = () => {
  const { hasPermission } = usePermissions();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pendingValidationsCount, setPendingValidationsCount] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Si es administrador, verificar solicitudes pendientes
    if (currentUser?.rol === 'administrador') {
      checkPendingValidations();
      // Verificar cada 30 segundos
      const interval = setInterval(checkPendingValidations, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  const checkPendingValidations = async () => {
    try {
      const pendingRequests = await getPendingValidations();
      setPendingValidationsCount(pendingRequests.length);
    } catch (error) {
      // Silenciar errores para no interferir con la UI
      console.error('Error al verificar solicitudes pendientes:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/LoginPage');
  };

  const activeClassName = "text-[#39B54A] border-b-2 border-[#39B54A]";
  const inactiveClassName = "text-white hover:text-[#39B54A] hover:border-b-2 hover:border-[#39B54A] transition-all duration-300";
  const canAccessAdmin = hasPermission(PERMISOS.VER_USUARIO) || 
                        hasPermission(PERMISOS.VER_PERMISOS) || 
                        hasPermission(PERMISOS.VER_ROLES);

  return ( 
    <div className="w-full">
      <header className="fixed top-0 left-0 w-full bg-black/95 backdrop-blur-sm border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo Section - Estandarizado */}
            <Link to="/" className="flex items-center gap-1 sm:gap-2 md:gap-3 hover:opacity-80 transition-all duration-300 min-w-0 flex-shrink-0 max-w-[55%] sm:max-w-[65%] md:max-w-none">
              <img 
                className="h-5 w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 object-contain flex-shrink-0" 
                src={imgLogoSenaGreen} 
                alt="LogoSena" 
              />
              <div className="min-w-0 flex-1 overflow-hidden">
                <h1 className="header-title text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                  Sena<span className="text-[#39B54A]">Unity</span>
                </h1>
                <p className="header-subtitle text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-white/60 leading-none truncate">
                  Centro de Comercio y Turismo - Quindío
                </p>
              </div>
            </Link>

            {/* Navigation Section - Desktop */}
            <nav className="hidden lg:flex items-center">
              <ul className="flex items-center gap-8">
                <NavLink 
                  to="/" 
                  end 
                  className={({isActive}) => 
                    `header-nav-link ${isActive ? activeClassName : inactiveClassName}`
                  }
                >
                  Inicio
                </NavLink>
                <NavLink 
                  to="/horarios" 
                  end 
                  className={({isActive}) => 
                    `header-nav-link ${isActive ? activeClassName : inactiveClassName}`
                  }
                >
                  Horarios
                </NavLink>
                <NavLink 
                  to="/eventos" 
                  end 
                  className={({isActive}) => 
                    `header-nav-link ${isActive ? activeClassName : inactiveClassName}`
                  }
                >
                  Eventos y Noticias
                </NavLink>
                {canAccessAdmin && (
                  <div className="relative">
                    <NavLink 
                      to="/admin" 
                      end 
                      className={({isActive}) => 
                        `header-nav-link ${isActive ? activeClassName : inactiveClassName}`
                      }
                    >
                      Administración
                    </NavLink>
                    {/* Indicador de solicitudes pendientes */}
                    {user?.rol === 'administrador' && pendingValidationsCount > 0 && (
                      <Link 
                        to="/admin/validations"
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse hover:bg-red-600 transition-colors"
                        title={`${pendingValidationsCount} solicitud(es) de validación pendiente(s)`}
                      >
                        {pendingValidationsCount}
                      </Link>
                    )}
                  </div>
                )}
              </ul>
            </nav>

            {/* User Section - Estandarizado */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
              {/* Botón de validaciones para administradores (móvil) */}
              {user?.rol === 'administrador' && pendingValidationsCount > 0 && (
                <Link 
                  to="/admin/validations"
                  className="lg:hidden relative bg-red-500 hover:bg-red-600 text-white p-1.5 sm:p-2 rounded-full transition-colors flex-shrink-0"
                  title={`${pendingValidationsCount} solicitud(es) pendiente(s)`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {pendingValidationsCount}
                  </span>
                </Link>
              )}

              {/* Botón de menú móvil */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-white p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 sm:h-6 sm:w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              
              {user ? (
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 px-2 sm:px-3 md:px-4 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 min-w-0"
                  >
                    <div className="relative flex-shrink-0">
                      <img 
                        src={user.avatar_url || imgUsuario} 
                        alt="Perfil" 
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-[#39B54A]"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-[#39B54A] rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-black"></div>
                      </div>
                    </div>
                    <span className="hidden md:block min-w-0">
                      <span className="header-user-name block">{user.nombre}</span>
                      {user.rol && (
                        <span className="header-user-role block">
                          ({user.rol})
                        </span>
                      )}
                    </span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-white/70 hover:text-white transition-all duration-300 p-1.5 sm:p-2 flex-shrink-0"
                    title="Cerrar sesión"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                <Link 
                  to="/LoginPage"
                  className="flex items-center gap-1.5 sm:gap-2 bg-[#39B54A] hover:bg-[#2d8f3a] text-black font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-full transition-all duration-300 shadow-lg shadow-[#39B54A]/20 flex-shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs sm:text-sm header-nav-link">Ingresar</span>
                </Link>
              )}
              
              {/* SenaUnity Logo */}
              <Link 
                to="/"
                className="transition-transform duration-300 hover:scale-110"
              >
                <img 
                  className="h-12 w-12 rounded-full object-cover" 
                  src={imgLogo} 
                  alt="SenaUnity" 
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        <div className={`lg:hidden bg-black/95 transition-all duration-300 ${isMenuOpen ? 'max-h-screen py-4' : 'max-h-0 overflow-hidden'}`}>
          <nav className="px-4">
            <ul className="flex flex-col space-y-4">
              <NavLink 
                to="/" 
                end 
                className={({isActive}) => 
                  `header-nav-link py-2 ${isActive ? activeClassName : inactiveClassName}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </NavLink>
              <NavLink 
                to="/horarios" 
                end 
                className={({isActive}) => 
                  `header-nav-link py-2 ${isActive ? activeClassName : inactiveClassName}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Horarios
              </NavLink>
              <NavLink 
                to="/eventos" 
                end 
                className={({isActive}) => 
                  `header-nav-link py-2 ${isActive ? activeClassName : inactiveClassName}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Eventos y Noticias
              </NavLink>
              {canAccessAdmin && (
                <div className="relative">
                  <NavLink 
                    to="/admin" 
                    end 
                    className={({isActive}) => 
                      `header-nav-link py-2 ${isActive ? activeClassName : inactiveClassName}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Administración
                  </NavLink>
                  {/* Acceso rápido a validaciones en móvil */}
                  {user?.rol === 'administrador' && pendingValidationsCount > 0 && (
                    <Link 
                      to="/admin/validations"
                      className="block mt-2 ml-4 text-sm text-red-400 hover:text-red-300 transition-colors py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ⚠️ {pendingValidationsCount} validación(es) pendiente(s)
                    </Link>
                  )}
                </div>
              )}
            </ul>
          </nav>
        </div>
      </header>
      
      {/* Spacer para evitar que el contenido se oculte detrás del header fijo */}
      <div className="h-16 sm:h-20"></div>
    </div>
  )
}