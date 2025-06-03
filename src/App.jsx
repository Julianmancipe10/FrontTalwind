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

// ...otros imports que tengas

function App() {
  return (
    <Router>
      <div>
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
    </Router>
  );
}

export default App;
