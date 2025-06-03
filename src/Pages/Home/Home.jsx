import React, { useEffect, useState } from "react";
import { Header } from "../../Layouts/Header/Header";
import Eventos from "../EventosNoticias/Eventos";
import Noticias from "../EventosNoticias/Noticias";
import Programas from "../../components/Programas/Programas";
import InstrucFuncionarios from "../../Layouts/InstrucFuncionarios/InstrucFuncionarios";
import NuestrasSedes from "../../Layouts/NuestrasSedes/NuestrasSedes";
import imgUsuario from '../../assets/images/imgUsuario.png';
import "../Home/Home.css";
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/auth';
import BotIcon from "../../components/BotIcon";
import ChatModal from "../../components/ChatModal";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/LoginPage');
  };

  const getWelcomeMessage = () => {
    if (!user) return "BIENVENIDOS";
    const nombreCompleto = `${user.nombre} ${user.apellido}`;
    return `¡Bienvenido ${user.rol || 'Usuario'} ${nombreCompleto}!`;
  };

  return (
    <div className="main-container">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <Header />
      
      <div className="top-section">
        <h1 className="h1Bienvenidos">{getWelcomeMessage()}</h1>
        {user ? (
          <>
            <button className="button-ingresar" onClick={handleLogout}>
              <div className="ingresar-wrapper">
                <img src={imgUsuario} alt="Usuario" style={{cursor:'pointer'}} />
                <span className="ingresar-text">Cerrar Sesión</span>
              </div>
            </button>
            <Link to="/profile" className="edit-profile-icon" title="Editar perfil">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="#25dfc4" strokeWidth="2"/>
                <path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" stroke="#25dfc4" strokeWidth="2"/>
                <path d="M17.5 17.5l2 2M19.5 17.5l-2 2" stroke="#e4e518" strokeWidth="2"/>
              </svg>
            </Link>
          </>
        ) : (
          <Link to="/LoginPage">
            <button className="button-ingresar">
              <div className="ingresar-wrapper">
                <img src={imgUsuario} alt="Usuario" style={{cursor:'pointer'}} />
                <span className="ingresar-text">Ingresar</span>
              </div>
            </button>
          </Link>
        )}
      </div>
      
      <div className="home-container">
        <div className="text-container">
          <div className='divh1TextHome'>
            <h1>
              No te pierdas los <span className="spanTxt">Eventos</span> y
              <span className='spanTxt'> Novedades</span> de tu <span className="spanTxt">SENA</span> más cercano, Infórmate, participa y aprovecha todas las oportunidades.
              Descubre <span className='spanTxt'> Talleres </span>, <span className='spanTxt'>Cursos</span> y mucho más para potenciar tu crecimiento personal y profesional.
            </h1>
          </div>
        </div>
        
        <div className="comp-card">
          <Eventos />
          <Noticias />
        </div>
      </div>
      
      <Programas />
      <InstrucFuncionarios />
      <NuestrasSedes />
      <BotIcon onClick={() => setIsChatOpen(true)} />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Home;
