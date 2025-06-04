import React, { useEffect, useState } from "react";
import { Header } from "../../Layouts/Header/Header";
import Eventos from "../EventosNoticias/Eventos";
import Noticias from "../EventosNoticias/Noticias";
import Programas from "../../components/Programas/Programas";
import InstrucFuncionarios from "../../Layouts/InstrucFuncionarios/InstrucFuncionarios";
import NuestrasSedes from "../../Layouts/NuestrasSedes/NuestrasSedes";
import imgUsuario from '../../assets/images/imgUsuario.png';
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
    <div className="min-h-screen w-full flex flex-col font-poppins bg-black text-white pt-32">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <Header />
      
      {/* Top Section */}
      <div className="w-11/12 mx-auto flex items-center justify-between relative px-4 mb-8">
        <h1 className="text-5xl font-extrabold uppercase tracking-wide">
          {getWelcomeMessage()}
        </h1>
      </div>

      {/* Main Content */}
      <div className="w-11/12 mx-auto flex flex-col lg:flex-row gap-8 px-4">
        {/* Text Section */}
        <div className="lg:w-2/5 space-y-6">
          <div className="text-3xl md:text-4xl font-bold leading-tight">
            <h1>
              No te pierdas los <span className="text-[#BFFF71]">Eventos</span> y
              <span className="text-[#BFFF71]"> Novedades</span> de tu <span className="text-[#BFFF71]">SENA</span> más cercano, Infórmate, participa y aprovecha todas las oportunidades.
              Descubre <span className="text-[#BFFF71]">Talleres</span>, <span className="text-[#BFFF71]">Cursos</span> y mucho más para potenciar tu crecimiento personal y profesional.
            </h1>
          </div>
        </div>

        {/* Cards Section */}
        <div className="lg:w-3/5 space-y-8">
          <Eventos />
          <Noticias />
        </div>
      </div>

      {/* Additional Sections */}
      <div className="w-full space-y-12 mt-12">
        <Programas />
        <InstrucFuncionarios />
        <NuestrasSedes />
      </div>

      {/* Chat Components */}
      <div className="fixed bottom-4 right-4 z-50">
        <BotIcon onClick={() => setIsChatOpen(true)} />
        <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  );
};

export default Home;
