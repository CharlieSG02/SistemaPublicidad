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
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-2xl border-b border-gray-700/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-gray-700 transition-all w-96"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <button className="relative p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-700/50">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-gray-800 animate-pulse"></span>
          </button>
          
          <div className="flex items-center space-x-3 bg-gray-700/30 px-4 py-2 rounded-xl border border-gray-700/50 hover:bg-gray-700/50 transition-colors">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-full shadow-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-white">{user?.email || 'Usuario'}</div>
              <div className="text-xs text-gray-400">Administrador</div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-xl transition-all duration-200 hover:scale-105"
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
