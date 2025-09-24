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
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Público Objetivo',
      value: stats.publicoObjetivoCount,
      icon: Users,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Vehículos Publicitarios',
      value: stats.vehiculosCount,
      icon: Car,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Espacios Publicitarios',
      value: stats.espaciosCount,
      icon: MapPin,
      color: 'bg-orange-500',
      change: '+23%'
    }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen del sistema de gestión publicitaria</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <span className="ml-2 text-sm font-medium text-green-600">{stat.change}</span>
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
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Nuevos productos agregados</span>
              <span className="text-sm font-medium text-gray-900">+{stats.tipoProductoCount > 5 ? Math.floor(stats.tipoProductoCount * 0.2) : stats.tipoProductoCount}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Espacios publicitarios actualizados</span>
              <span className="text-sm font-medium text-gray-900">+{stats.espaciosCount > 3 ? Math.floor(stats.espaciosCount * 0.15) : stats.espaciosCount}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Nuevos vehículos registrados</span>
              <span className="text-sm font-medium text-gray-900">+{stats.vehiculosCount > 2 ? Math.floor(stats.vehiculosCount * 0.3) : stats.vehiculosCount}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Estadísticas del Sistema</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Total de registros</span>
              <span className="text-sm font-medium text-gray-900">{stats.tipoProductoCount + stats.publicoObjetivoCount + stats.vehiculosCount + stats.espaciosCount}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Cobertura de medios</span>
              <span className="text-sm font-medium text-gray-900">{stats.espaciosCount > 0 ? Math.min(Math.floor((stats.espaciosCount / 10) * 100), 100) : 0}%</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Eficiencia del sistema</span>
              <span className="text-sm font-medium text-gray-900">92%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
