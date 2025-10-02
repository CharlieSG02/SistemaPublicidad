import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  Home, 
  Folder, 
  Package, 
  Users, 
  Car, 
  MapPin, 
  UserCheck,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Menu,
  X
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
      icon: Package,
      shortName: 'Producto'
    },
    { 
      name: 'Público Objetivo', 
      path: '/catalogos/publico-objetivo', 
      icon: Users,
      shortName: 'Público'
    },
    { 
      name: 'Vehículos Publicitarios', 
      path: '/catalogos/vehiculos-publicitarios', 
      icon: Car,
      shortName: 'Vehículos'
    },
    { 
      name: 'Espacios Publicitarios', 
      path: '/catalogos/espacios-publicitarios', 
      icon: MapPin,
      shortName: 'Espacios'
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

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        bg-white shadow-lg border-r border-gray-200
        transition-all duration-100 ease-in-out
        ${sidebarWidth} 
        lg:translate-x-0 ${mobileSidebar}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-800 whitespace-nowrap">
              Gestión Publicitaria
            </h1>
          )}
          <div className="flex items-center space-x-2">
            {/* Botón cerrar móvil */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-4 w-4" />
            </button>
            
            {/* Botón colapsar/expandir */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-1 hover:bg-gray-100 rounded transition-colors"
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
                flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors
                ${isActive('/') 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
                ${isCollapsed ? 'justify-center px-2' : ''}
              `}
              title={isCollapsed ? 'Dashboard' : ''}
            >
              <Home className={`${isCollapsed ? 'h-5 w-5' : 'h-5 w-5 mr-3'}`} />
              {!isCollapsed && 'Dashboard'}
            </Link>

            {/* Catálogos */}
            <div>
              {isCollapsed ? (
                <button
                  onClick={() => setCatalogosOpen(!catalogosOpen)}
                  className={`
                    w-full flex items-center justify-center px-3 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isCatalogosActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  title="Catálogos"
                >
                  <Folder className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={() => setCatalogosOpen(!catalogosOpen)}
                  className={`
                    w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isCatalogosActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
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
              )}

              <AnimatePresence>
                {catalogosOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.1 }}
                    className={`${isCollapsed ? 'ml-0' : 'ml-4'} mt-1 space-y-1`}
                  >
                    {catalogoItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`
                            flex items-center px-3 py-2 text-sm rounded-lg transition-colors
                            ${isActive(item.path)
                              ? 'bg-blue-100 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                            ${isCollapsed ? 'justify-center px-2' : ''}
                          `}
                          title={isCollapsed ? item.name : ''}
                        >
                          <Icon className={`${isCollapsed ? 'h-4 w-4' : 'h-4 w-4 mr-3'}`} />
                          {!isCollapsed && item.name}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Relaciones */} 
            {/*
            <div>
              {isCollapsed ? (
                <button
                  onClick={() => setRelacionesOpen(!relacionesOpen)}
                  className={`
                    w-full flex items-center justify-center px-3 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isRelacionesActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  title="Relaciones"
                >
                  <Folder className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={() => setRelacionesOpen(!relacionesOpen)}
                  className={`
                    w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isRelacionesActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
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
              )}

              <AnimatePresence>
                {relacionesOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 5 }}
                    className={`${isCollapsed ? 'ml-0' : 'ml-4'} mt-1 space-y-1`}
                  >
                    {relacionesItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`
                            flex items-center px-3 py-2 text-sm rounded-lg transition-colors
                            ${isActive(item.path)
                              ? 'bg-blue-100 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                            ${isCollapsed ? 'justify-center px-2' : ''}
                          `}
                          title={isCollapsed ? item.name : ''}
                        >
                          <Icon className={`${isCollapsed ? 'h-4 w-4' : 'h-4 w-4 mr-3'}`} />
                          {!isCollapsed && item.name}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>*/}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;