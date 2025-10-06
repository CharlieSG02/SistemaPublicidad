import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  Home, 
  Folder, 
  Package, 
  Users, 
  Truck, 
  MapPin, 
  UserCheck,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Menu,
  X,
  LayoutDashboard,
  ShoppingBag,
  Target,
  Navigation,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [catalogosOpen, setCatalogosOpen] = useState(false);
  const [relacionesOpen, setRelacionesOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const catalogoItems = [
    { 
      name: 'Tipo de Producto', 
      path: '/catalogos/tipo-producto', 
      icon: ShoppingBag,
      shortName: 'Producto',
      gradient: 'from-blue-500 to-purple-600'
    },
    { 
      name: 'Público Objetivo', 
      path: '/catalogos/publico-objetivo', 
      icon: Target,
      shortName: 'Público',
      gradient: 'from-purple-500 to-pink-600'
    },
    { 
      name: 'Vehículos Publicitarios', 
      path: '/catalogos/vehiculos-publicitarios', 
      icon: Truck,
      shortName: 'Vehículos',
      gradient: 'from-orange-500 to-red-600'
    },
    { 
      name: 'Espacios Publicitarios', 
      path: '/catalogos/espacios-publicitarios', 
      icon: Navigation,
      shortName: 'Espacios',
      gradient: 'from-green-500 to-teal-600'
    }
  ];

  const relacionesItems = [
    { 
      name: 'Tipo de ProductoxPublico Objetivo', 
      path: '/relaciones/productoXpublico', 
      icon: UserCheck,
      shortName: 'Prod x Público'
    },
    { 
      name: 'Publico Objetivo X Vehículos Publicitarios', 
      path: '/relaciones/vehiculoXespacios', 
      icon: Users,
      shortName: 'Público x Vehículos'
    }
  ];

  const isActive = (path) => location.pathname === path;
  const isCatalogosActive = catalogoItems.some(item => isActive(item.path));
  const isRelacionesActive = relacionesItems.some(item => isActive(item.path));

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    // Cerrar submenús al colapsar
    if (!isCollapsed) {
      setCatalogosOpen(false);
      setRelacionesOpen(false);
    }
  };

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';
  const mobileSidebar = isMobileOpen ? 'translate-x-0' : '-translate-x-full';

  return (
    <>
      {/* Botón móvil */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay móvil */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Tema Oscuro */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-2xl border-r border-gray-700/50
        transition-all duration-300 ease-in-out
        ${sidebarWidth} 
        lg:translate-x-0 ${mobileSidebar}
      `}>
        {/* Header con gradiente oscuro */}
        <div className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg shadow-blue-500/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-white whitespace-nowrap">
                Gestión Publicitaria
              </h1>
            </div>
          )}
          {isCollapsed && (
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg shadow-blue-500/20 mx-auto">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          )}
          <div className="flex items-center space-x-2">
            {/* Botón cerrar móvil */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors text-gray-300 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            
            {/* Botón colapsar/expandir - SIEMPRE VISIBLE */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors text-gray-300 hover:text-white"
              title={isCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
            >
              {isCollapsed ? (
                <ChevronRightIcon className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        
        {/* Navegación */}
        <nav className="mt-6">
          <div className="px-2 space-y-1">
            {/* Dashboard */}
            <Link
              to="/"
              className={`
                group flex items-center px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-200
                ${isActive('/') 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105' 
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:scale-105'
                }
                ${isCollapsed ? 'justify-center px-2' : ''}
              `}
              title={isCollapsed ? 'Dashboard' : ''}
            >
              <div className={`${isActive('/') ? 'bg-white/20' : 'bg-gray-700/50 group-hover:bg-gray-600/50'} p-1.5 rounded-lg ${isCollapsed ? '' : 'mr-3'}`}>
                <LayoutDashboard className={`h-4 w-4 ${isActive('/') ? 'text-white' : 'text-blue-400 group-hover:text-blue-300'}`} />
              </div>
              {!isCollapsed && 'Dashboard'}
            </Link>

            {/* Catálogos */}
            <div className="mt-6">
              {!isCollapsed && (
                <p className="px-3 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Catálogos
                </p>
              )}
              {isCollapsed ? (
                <button
                  onClick={() => setCatalogosOpen(!catalogosOpen)}
                  className={`
                    group w-full flex items-center justify-center px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-200
                    ${isCatalogosActive 
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/50' 
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }
                  `}
                  title="Catálogos"
                >
                  <div className={`${isCatalogosActive ? 'bg-white/20' : 'bg-gray-700/50 group-hover:bg-gray-600/50'} p-1.5 rounded-lg`}>
                    <Folder className={`h-4 w-4 ${isCatalogosActive ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-300'}`} />
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => setCatalogosOpen(!catalogosOpen)}
                  className={`
                    group w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200
                    ${isCatalogosActive 
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/50' 
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <div className={`${isCatalogosActive ? 'bg-white/20' : 'bg-gray-700/50 group-hover:bg-gray-600/50'} p-1.5 rounded-lg mr-3`}>
                      <Folder className={`h-4 w-4 ${isCatalogosActive ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-300'}`} />
                    </div>
                    Catálogos
                  </div>
                  {catalogosOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}

              <AnimatePresence>
                {catalogosOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`${isCollapsed ? 'ml-0' : 'ml-2'} mt-2 space-y-1.5`}
                  >
                    {catalogoItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.path}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            to={item.path}
                            className={`
                              group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                              ${isActive(item.path)
                                ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-${item.gradient.split('-')[1]}-500/50 scale-105`
                                : 'text-gray-400 hover:bg-gray-700/30 hover:text-white hover:scale-105'
                              }
                              ${isCollapsed ? 'justify-center px-2' : ''}
                            `}
                            title={isCollapsed ? item.name : ''}
                          >
                            <div className={`${isActive(item.path) ? 'bg-white/20' : 'bg-gray-700/30 group-hover:bg-gray-600/30'} p-1.5 rounded-lg ${isCollapsed ? '' : 'mr-3'}`}>
                              <Icon className={`h-3.5 w-3.5 ${isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`} />
                            </div>
                            {!isCollapsed && (
                              <span className="flex-1">{item.name}</span>
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;