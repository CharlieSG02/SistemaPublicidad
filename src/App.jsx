import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductosPage from './pages/ProductosPage'
import EspaciosPublicitarios from './pages/EspaciosPublicitarios';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PublicosPage from './pages/PublicosPage';
import VehiculosPage from './pages/VehiculosPage';

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
              <Route path="/catalogos/tipo-producto" element={<ProductosPage />} />
              <Route path="/catalogos/publico-objetivo" element={<PublicosPage />} />
              <Route path="/catalogos/vehiculos-publicitarios" element={<VehiculosPage />} />
              <Route path="/catalogos/espacios-publicitarios" element={<EspaciosPublicitarios />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
