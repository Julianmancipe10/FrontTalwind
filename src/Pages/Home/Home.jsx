import React, { useEffect, useState } from "react";
import { Header } from "../../Layouts/Header/Header";
import Eventos from "../EventosNoticias/Eventos";
import Noticias from "../EventosNoticias/Noticias";
import Programas from "../../components/Programas/Programas";
import InstrucFuncionarios from "../../Layouts/InstrucFuncionarios/InstrucFuncionarios";
import NuestrasSedes from "../../Layouts/NuestrasSedes/NuestrasSedes";
import imgUsuario from '../../assets/images/optimized/optimized_imgUsuario.png';
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
    <div className="min-h-screen w-full flex flex-col font-poppins bg-[#1a1f2e] text-white">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <Header />
      
      {/* Hero Section */}
      <section className="w-full pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-wide">
              {getWelcomeMessage()}
            </h1>
            <div className="max-w-3xl mx-auto text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed">
              <p>
                No te pierdas los <span className="text-[#BFFF71]">Eventos</span> y
                <span className="text-[#BFFF71]"> Novedades</span> de tu <span className="text-[#BFFF71]">SENA</span> más cercano.
              </p>
              <p className="mt-4">
                Infórmate, participa y aprovecha todas las oportunidades.
                Descubre <span className="text-[#BFFF71]">Talleres</span>, <span className="text-[#BFFF71]">Cursos</span> y mucho más
                para potenciar tu crecimiento personal y profesional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Eventos y Noticias Section */}
      <section className="w-full py-12 px-4 md:px-8 bg-[#1a1f2e]">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Eventos */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#BFFF71] text-center mb-8">
              Eventos Destacados
            </h2>
            <Eventos />
          </div>

          {/* Noticias */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#BFFF71] text-center mb-8">
              Últimas Noticias
            </h2>
            <Noticias />
          </div>
        </div>
      </section>

      {/* Additional Sections */}
      <div className="w-full space-y-16 py-12 bg-[#1a1f2e]">
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
