// En tu página o componente
import React, { useState, useEffect } from "react";
import EspaciosTable from "../components/Espacios/EspaciosTable";
import { espaciosAPI } from "../lib/crudEspaciosAPI";
import { Filter, Megaphone, BarChart3 } from "lucide-react";

export default function EspaciosPage() {
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEspacios();
  }, []);

  const cargarEspacios = async () => {
    try {
      setLoading(true);
      const data = await espaciosAPI.getAllEspacios();
      setEspacios(data);
    } catch (error) {
      console.error("Error cargando espacios:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Título */}
      <div className="flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700/50 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/50">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
              Espacios Publicitarios
            </h1>
            <p className="text-lg text-gray-400 mt-2 font-medium">
              Gestiona y consulta todos los espacios publicitarios disponibles
            </p>
          </div>
        </div>
        <div className="text-right max-w-md">
          <p className="text-sm text-gray-300 bg-gray-700/50 px-4 py-2 rounded-lg border border-gray-600/50 shadow-sm">
            <span className="font-semibold text-blue-400">📊</span> Explora y filtra los espacios por medio, categoría o alcance
          </p>
        </div>
      </div>

      {/* Indicador de estado */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
          <span className="text-sm font-medium text-gray-300">
            {loading ? 'Cargando espacios publicitarios...' : `${espacios.length} espacios encontrados`}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Filter className="h-4 w-4" />
          <span>Utiliza los filtros para encontrar espacios específicos</span>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-3xl shadow-2xl border border-gray-700/50 backdrop-blur-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-200">Cargando espacios publicitarios</p>
              <p className="text-sm text-gray-400 mt-1">Estamos preparando tu información...</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-sm"></div>
            <div className="relative bg-gray-800/30 rounded-2xl border border-gray-700/50 shadow-inner">
              <EspaciosTable data={espacios} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}