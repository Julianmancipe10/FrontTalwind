import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Eventos from "./Pages/EventosNoticias/Eventos";
import FAQ from "./Pages/FAQ/FAQ";
import VerMasEvento from "./Pages/EventosNoticias/VerMas/VerMasEvento";
import VerMasNoticia from "./Pages/EventosNoticias/VerMas/VerMasNoticia";
import LoginPage from "./Pages/LoginPage/LoginPage";
import Profile from "./Pages/Profile/Profile";
import Horario from "./Pages/Horarios/Horario";
import Register from "./components/Register/Register";
import AdminPanel from "./Pages/Admin/AdminPanel";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PERMISOS } from "./constants/roles";
import CarrerasTecnologicas from "./components/CarrerasTecnologicas/CarrerasTecnologicas";
import CrearCarrera from "./components/CrearCarrera/CrearCarrera";

// ...otros imports que tengas

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-green-500">Bienvenido a SenaUnity</h1>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/horarios" element={<Horario />} />
            <Route path="/evento/:id" element={<VerMasEvento />} />
            <Route path="/noticia/:id" element={<VerMasNoticia />} />
            <Route path="/carreras-tecnologicas" element={<CarrerasTecnologicas />} />
            <Route path="/crear-carrera" element={<CrearCarrera />} />
            
            {/* Rutas protegidas del panel de administración */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute 
                  requiredPermissions={[
                    PERMISOS.VER_USUARIO,
                    PERMISOS.VER_PERMISOS,
                    PERMISOS.VER_ROLES
                  ]}
                >
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
