import React, { useState, useEffect } from 'react';
import { Package, Users, Car, MapPin, TrendingUp, BarChart3, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import { dashboardAPI } from '../lib/supabase';

const Dashboard = () => {
  const [stats, setStats] = useState({
    tipoProductoCount: 0,
    publicoObjetivoCount: 0,
    vehiculosCount: 0,
    espaciosCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadStats();
  };

  const statsCards = [
    {
      title: 'Tipos de Producto',
      value: stats.tipoProductoCount,
      icon: Package,
      gradient: 'from-blue-500 to-purple-600',
      bgGradient: 'from-blue-900/20 to-purple-900/20',
      iconBg: 'from-blue-500 to-purple-600',
      change: '+12%'
    },
    {
      title: 'Público Objetivo',
      value: stats.publicoObjetivoCount,
      icon: Users,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-900/20 to-pink-900/20',
      iconBg: 'from-purple-500 to-pink-600',
      change: '+8%'
    },
    {
      title: 'Vehículos Publicitarios',
      value: stats.vehiculosCount,
      icon: Car,
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-900/20 to-red-900/20',
      iconBg: 'from-orange-500 to-red-600',
      change: '+15%'
    },
    {
      title: 'Espacios Publicitarios',
      value: stats.espaciosCount,
      icon: MapPin,
      gradient: 'from-green-500 to-teal-600',
      bgGradient: 'from-green-900/20 to-teal-900/20',
      iconBg: 'from-green-500 to-teal-600',
      change: '+23%'
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700/50 shadow-2xl">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-gray-400 mt-1">Resumen del sistema de gestión publicitaria</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/50 hover:scale-105"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6 hover:scale-105 transition-all duration-200 cursor-pointer group`}
            >
              <div className="flex items-center">
                <div className={`bg-gradient-to-br ${stat.iconBg} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                  <div className="flex items-center">
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <span className="ml-2 text-sm font-medium text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full">{stat.change}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Actividad Reciente</h3>
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 px-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
              <span className="text-sm text-gray-300">Nuevos productos agregados</span>
              <span className="text-sm font-bold text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full">+{stats.tipoProductoCount > 5 ? Math.floor(stats.tipoProductoCount * 0.2) : stats.tipoProductoCount}</span>
            </div>
            <div className="flex items-center justify-between py-3 px-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
              <span className="text-sm text-gray-300">Espacios publicitarios actualizados</span>
              <span className="text-sm font-bold text-green-400 bg-green-900/30 px-3 py-1 rounded-full">+{stats.espaciosCount > 3 ? Math.floor(stats.espaciosCount * 0.15) : stats.espaciosCount}</span>
            </div>
            <div className="flex items-center justify-between py-3 px-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
              <span className="text-sm text-gray-300">Nuevos vehículos registrados</span>
              <span className="text-sm font-bold text-orange-400 bg-orange-900/30 px-3 py-1 rounded-full">+{stats.vehiculosCount > 2 ? Math.floor(stats.vehiculosCount * 0.3) : stats.vehiculosCount}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Estadísticas del Sistema</h3>
            <BarChart3 className="h-5 w-5 text-purple-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 px-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
              <span className="text-sm text-gray-300">Total de registros</span>
              <span className="text-sm font-bold text-purple-400 bg-purple-900/30 px-3 py-1 rounded-full">{stats.tipoProductoCount + stats.publicoObjetivoCount + stats.vehiculosCount + stats.espaciosCount}</span>
            </div>
            <div className="flex items-center justify-between py-3 px-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
              <span className="text-sm text-gray-300">Cobertura de medios</span>
              <span className="text-sm font-bold text-pink-400 bg-pink-900/30 px-3 py-1 rounded-full">{stats.espaciosCount > 0 ? Math.min(Math.floor((stats.espaciosCount / 10) * 100), 100) : 0}%</span>
            </div>
            <div className="flex items-center justify-between py-3 px-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
              <span className="text-sm text-gray-300">Eficiencia del sistema</span>
              <span className="text-sm font-bold text-green-400 bg-green-900/30 px-3 py-1 rounded-full">92%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
