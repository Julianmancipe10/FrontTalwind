import React from 'react'
import imgLogo from '../../assets/images/Logo_SenaUnity.png'
import imgLogoSenaGreen from '../../assets/images/Logo-Sena-Green.png'
import '../Header/Header.css'
import { NavLink } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISOS } from '../../constants/roles';

export const Header = () => {
  const { hasPermission } = usePermissions();
  const canAccessAdmin = hasPermission(PERMISOS.VER_USUARIO) || 
                        hasPermission(PERMISOS.VER_PERMISOS) || 
                        hasPermission(PERMISOS.VER_ROLES);

  return ( 
    <div>
        <header className='DivHeader'>
            <h1>Sena<span>Unity</span></h1>
            <img className='LogoSena' src={imgLogoSenaGreen} alt="LogoSena" />
            <div className="logo-container">
                <div className="centro-comercio-text">
                    Centro de Comercio y Turismo<br />
                    Regional Quindío
                </div>
            </div>

            <nav>
                <ul>
                    <li className='iten'>
                    <NavLink to="/" end className={({isActive}) => isActive ? "active" : ""} style={{textAlign: 'left'}}>Inicio</NavLink>
                    <NavLink to="/contacto" end className={({isActive}) => isActive ? "active" : ""} style={{textAlign: 'left'}}>Contacto</NavLink>
                    <NavLink to="/horarios" end className={({isActive}) => isActive ? "active" : ""} style={{textAlign: 'left'}}>Horarios</NavLink>
                    <NavLink to="/eventos" end className={({isActive}) => isActive ? "active" : ""} style={{textAlign: 'left'}}>Eventos y Noticias</NavLink>
                    {canAccessAdmin && (
                      <NavLink 
                        to="/admin" 
                        end 
                        className={({isActive}) => isActive ? "active" : ""} 
                        style={{textAlign: 'left'}}
                      >
                        Administración
                      </NavLink>
                    )}
                    </li>
                </ul>
            </nav>
            <img className='imgSenaUnity' src={imgLogo} alt="SenaUnity" />
        </header>
    </div>
  )
}