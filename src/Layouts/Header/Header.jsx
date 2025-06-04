import React, { useEffect, useState } from 'react'
import imgLogo from '../../assets/images/optimized/optimized_Logo_SenaUnity.png'
import imgLogoSenaGreen from '../../assets/images/optimized/optimized_logo-sena-green.png'
import imgUsuario from '../../assets/images/optimized/optimized_imgUsuario.png'
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISOS } from '../../constants/roles';
import { getCurrentUser } from '../../services/auth';

export const Header = () => {
  const { hasPermission } = usePermissions();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/LoginPage');
  };

  const activeClassName = "text-[#BFFF71] border-b-2 border-[#BFFF71]";
  const inactiveClassName = "text-white hover:text-[#BFFF71] hover:border-b-2 hover:border-[#BFFF71] transition-all duration-300";
  const canAccessAdmin = hasPermission(PERMISOS.VER_USUARIO) || 
                        hasPermission(PERMISOS.VER_PERMISOS) || 
                        hasPermission(PERMISOS.VER_ROLES);

  return ( 
    <div className="w-full">
      <header className="fixed top-0 left-0 w-full bg-black/95 backdrop-blur-sm border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-all duration-300">
              <img 
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain" 
                src={imgLogoSenaGreen} 
                alt="LogoSena" 
              />
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-none">
                  Sena<span className="text-[#BFFF71]">Unity</span>
                </h1>
                <p className="text-[10px] sm:text-xs text-white/70">Centro de Comercio y Turismo - Quindío</p>
              </div>
            </Link>

            {/* Navigation Section - Desktop */}
            <nav className="hidden md:flex items-center">
              <ul className="flex items-center gap-8">
                <NavLink 
                  to="/" 
                  end 
                  className={({isActive}) => 
                    `text-base font-medium transition-all duration-300 ${isActive ? activeClassName : inactiveClassName}`
                  }
                >
                  Inicio
                </NavLink>
                <NavLink 
                  to="/horarios" 
                  end 
                  className={({isActive}) => 
                    `text-base font-medium transition-all duration-300 ${isActive ? activeClassName : inactiveClassName}`
                  }
                >
                  Horarios
                </NavLink>
                <NavLink 
                  to="/eventos" 
                  end 
                  className={({isActive}) => 
                    `text-base font-medium transition-all duration-300 ${isActive ? activeClassName : inactiveClassName}`
                  }
                >
                  Eventos y Noticias
                </NavLink>
                {canAccessAdmin && (
                  <NavLink 
                    to="/admin" 
                    end 
                    className={({isActive}) => 
                      `text-base font-medium transition-all duration-300 ${isActive ? activeClassName : inactiveClassName}`
                    }
                  >
                    Administración
                  </NavLink>
                )}
              </ul>
            </nav>

            {/* User Section */}
            <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
              {/* Botón de menú móvil */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-white p-1 sm:p-2"
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
                <div className="flex items-center gap-2 sm:gap-4">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 px-2 sm:px-4 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="relative">
                      <img 
                        src={user.avatar_url || imgUsuario} 
                        alt="Perfil" 
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-[#BFFF71]"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-[#BFFF71] rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-black"></div>
                      </div>
                    </div>
                    <span className="hidden md:block text-sm font-medium text-white">
                      {user.nombre}
                    </span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-white/70 hover:text-white transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                <Link 
                  to="/LoginPage"
                  className="flex items-center gap-1 sm:gap-2 bg-[#BFFF71] hover:bg-[#a8e65c] text-black font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-full transition-all duration-300 shadow-lg shadow-[#BFFF71]/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base">Ingresar</span>
                </Link>
              )}
              
              {/* SenaUnity Logo */}
              <Link 
                to="/"
                className="transition-transform duration-300 hover:scale-110"
              >
                <img 
                  className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full object-cover" 
                  src={imgLogo} 
                  alt="SenaUnity" 
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        <div className={`md:hidden bg-black/95 transition-all duration-300 ${isMenuOpen ? 'max-h-screen py-4' : 'max-h-0 overflow-hidden'}`}>
          <nav className="px-4">
            <ul className="flex flex-col space-y-4">
              <NavLink 
                to="/" 
                end 
                className={({isActive}) => 
                  `text-base font-medium transition-all duration-300 ${isActive ? activeClassName : inactiveClassName}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </NavLink>
              <NavLink 
                to="/horarios" 
                end 
                className={({isActive}) => 
                  `text-base font-medium transition-all duration-300 ${isActive ? activeClassName : inactiveClassName}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Horarios
              </NavLink>
              <NavLink 
                to="/eventos" 
                end 
                className={({isActive}) => 
                  `text-base font-medium transition-all duration-300 ${isActive ? activeClassName : inactiveClassName}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Eventos y Noticias
              </NavLink>
              {canAccessAdmin && (
                <NavLink 
                  to="/admin" 
                  end 
                  className={({isActive}) => 
                    `text-base font-medium transition-all duration-300 ${isActive ? activeClassName : inactiveClassName}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Administración
                </NavLink>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <div className="h-16 md:h-20"></div>
    </div>
  )
}