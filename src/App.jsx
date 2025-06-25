import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Eventos from "./Pages/EventosNoticias/Eventos";
import Noticias from "./Pages/EventosNoticias/Noticias";
import EventosNoticias from "./Pages/EventosNoticias/EventosNoticias";
import FAQ from "./Pages/FAQ/FAQ";
import VerMasEvento from "./Pages/EventosNoticias/VerMas/VerMasEvento";
import VerMasNoticia from "./Pages/EventosNoticias/VerMas/VerMasNoticia";
import LoginPage from "./Pages/LoginPage/LoginPage";
import Profile from "./Pages/Profile/Profile";
import Horario from "./Pages/Horarios/Horario";
import Register from "./components/Register/Register";
import AdminPanel from "./Pages/Admin/AdminPanel";
import ValidationManager from "./Pages/Admin/ValidationManager";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PERMISOS } from "./constants/roles";
import CarrerasTecnologicas from "./components/CarrerasTecnologicas/CarrerasTecnologicas";
import CarrerasCortas from "./components/CarrerasCortas/CarrerasCortas";
import CrearCarrera from "./components/CrearCarrera/CrearCarrera";
import CrearEvento from "./Pages/EventosNoticias/CrearEventos/CrearEvento";
import CrearNoticia from "./Pages/EventosNoticias/CrearNoticias/CrearNoticia";
import VerMasCarrera from "./Pages/Carreras/VerMasCarrera";
import Footer from "./components/Footer";

// Componente para verificar si el usuario es administrador
const AdminOnlyRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.rol !== 'administrador') {
    return <div>Acceso denegado. Solo para administradores.</div>;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/eventos-y-noticias" element={<EventosNoticias />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/horarios" element={<Horario />} />
            <Route path="/evento/:id" element={<VerMasEvento />} />
            <Route path="/noticia/:id" element={<VerMasNoticia />} />
            <Route path="/carrera/:id" element={<VerMasCarrera />} />
            <Route path="/carreras-tecnologicas" element={<CarrerasTecnologicas />} />
            <Route path="/carreras-cortas" element={<CarrerasCortas />} />
            <Route path="/crear-carrera" element={<CrearCarrera />} />
            
            {/* Rutas para creación de contenido */}
            <Route path="/crear-evento" element={<CrearEvento />} />
            <Route path="/crear-noticia" element={<CrearNoticia />} />
            
            {/* Rutas protegidas del panel de administración */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute 
                  requiredPermissions={[
                    PERMISOS.VER_USUARIO,
                    PERMISOS.ASIGNAR_PERMISOS
                  ]}
                >
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/validaciones" 
              element={
                <AdminOnlyRoute>
                  <ValidationManager />
                </AdminOnlyRoute>
              } 
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
