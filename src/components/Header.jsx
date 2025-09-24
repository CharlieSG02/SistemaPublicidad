import React from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../lib/supabase';

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('No se pudo cerrar la sesión.');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-96"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <button className="relative p-2 text-gray-400 hover:text-gray-500">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="bg-gray-200 p-2 rounded-full">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-gray-900">{user?.email || 'Usuario'}</div>
              <div className="text-xs text-gray-500">Administrador</div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
