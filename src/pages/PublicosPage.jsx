// pages/PublicosPage.jsx
import { useEffect, useState } from "react";
import { publicoAPI } from "../lib/crudPublicosAPI";
import { PublicosTable } from "../components/PublicosConVehiculos/PublicosTable";
import ModalVehiculosRelacion from "../components/PublicosConVehiculos/ModalVehiculosRelacion";
import { Users, Target, Filter, Truck } from 'lucide-react';

export default function PublicosPage() {
  const [publicos, setPublicos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicos = async () => {
      try {
        setLoading(true);
        const data = await publicoAPI.getAll();
        setPublicos(data);
      } catch (error) {
        console.error("Error cargando públicos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicos();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Título */}
      <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-200/50 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
              Públicos Objetivo
            </h1>
            <p className="text-lg text-gray-600 mt-2 font-medium">
              Gestiona los vehículos publicitarios para cada público objetivo
            </p>
          </div>
        </div>
        <div className="text-right max-w-md">
          <p className="text-sm text-gray-500 bg-white/80 px-4 py-2 rounded-lg border border-gray-200/50 shadow-sm">
            <span className="font-semibold text-purple-600">💡</span> Selecciona un público para ver sus vehículos relacionados
          </p>
        </div>
      </div>

      {/* Indicador de estado */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
          <span className="text-sm font-medium text-gray-600">
            {loading ? 'Cargando públicos...' : `${publicos.length} públicos encontrados`}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Filter className="h-4 w-4" />
          <span>Selecciona un público para ver detalles</span>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-gradient-to-br from-white to-gray-50/50 p-6 rounded-3xl shadow-xl border border-gray-200/30 backdrop-blur-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">Cargando públicos objetivo</p>
              <p className="text-sm text-gray-500 mt-1">Estamos preparando tu información...</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-3xl blur-sm"></div>
            <div className="relative bg-white/80 rounded-2xl border border-white/50 shadow-inner">
              <PublicosTable data={publicos} onSelect={setSelected} />
            </div>
          </div>
        )}
      </div>

      {/* Modal de relaciones */}
      <ModalVehiculosRelacion
        publico={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
