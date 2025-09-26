import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Home, Folder, Package, Users, Car, MapPin,UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [catalogosOpen, setCatalogosOpen] = useState(false);
  const [relacionesOpen, setRelacionesOpen] = useState(false);
  const location = useLocation();

  const catalogoItems = [
    { 
      name: 'Tipo de Producto', 
      path: '/catalogos/tipo-producto', 
      icon: Package 
    },
    { 
      name: 'Público Objetivo', 
      path: '/catalogos/publico-objetivo', 
      icon: Users 
    },
    { 
      name: 'Vehículos Publicitarios', 
      path: '/catalogos/vehiculos-publicitarios', 
      icon: Car 
    },
    { 
      name: 'Espacios Publicitarios', 
      path: '/catalogos/espacios-publicitarios', 
      icon: MapPin 
    }
  ];

  const relacionesItems = [
    { 
      name: 'Tipo de ProductoxPublico Objetivo', 
      path: '/relaciones/productoXpublico', 
      icon: UserCheck 
    },
    { 
      name: 'Publico Objetivo X Vehículos Publicitarios', 
      path: '/relaciones/vehiculoXespacios', 
      icon: Users 
    }
  ];

  const isActive = (path) => location.pathname === path;
  const isCatalogosActive = catalogoItems.some(item => isActive(item.path));
  const isRelacionesActive = relacionesItems.some(item => isActive(item.path));

  return (
    <div className="bg-white w-64 shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Gestión Publicitaria</h1>
      </div>
      
      <nav className="mt-6">
        <div className="px-4 space-y-2">
          {/* Dashboard */}
          <Link
            to="/"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive('/') 
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </Link>

          {/* Catálogos */}
          <div>
            <button
              onClick={() => setCatalogosOpen(!catalogosOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isCatalogosActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center">
                <Folder className="mr-3 h-5 w-5" />
                Catálogos
              </div>
              {catalogosOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            <AnimatePresence>
              {catalogosOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-4 mt-2 space-y-1"
                >
                  {catalogoItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                          isActive(item.path)
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Relaciones */}  
          <div>
            <button
              onClick={() => setRelacionesOpen(!relacionesOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isRelacionesActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center">
                <Folder className="mr-3 h-5 w-5" />
                Relaciones
              </div>
              {relacionesOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            <AnimatePresence>
              {relacionesOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-4 mt-2 space-y-1"
                >
                  {relacionesItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                          isActive(item.path)
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>    

        </div>
      </nav>
    </div>
  );
};

export default Sidebar;