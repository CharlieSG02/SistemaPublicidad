import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TipoProducto from './pages/TipoProducto';
import PublicoObjetivo from './pages/PublicoObjetivo';
import VehiculosPublicitarios from './pages/VehiculosPublicitarios';
import EspaciosPublicitarios from './pages/EspaciosPublicitarios';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductoXPublico from './pages/TipoProductXPublicObjetivo.JSX';
import SelectorRelaciones from './pages/SelectorRelaciones';
import VehiculosPage from './components/VehiculosXEspacios/pages/VehiculosPage';
import PublicosPage from './pages/PublicosPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/catalogos/tipo-producto" element={<TipoProducto />} />
              <Route path="/catalogos/publico-objetivo" element={<PublicosPage />} />
              <Route path="/catalogos/vehiculos-publicitarios" element={<VehiculosPublicitarios />} />
              <Route path="/catalogos/espacios-publicitarios" element={<EspaciosPublicitarios />} />
              <Route path="/relaciones/productoXpublico" element={<SelectorRelaciones />} />
              <Route path="/relaciones/vehiculoXespacios" element={<VehiculosPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
