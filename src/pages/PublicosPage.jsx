// pages/PublicosPage.jsx
import { useEffect, useState } from "react";
import { publicoAPI } from "../lib/crudPublicosAPI";
import { PublicosTable } from "../components/PublicosConVehiculos/PublicosTable";
import ModalVehiculosRelacion from "../components/PublicosConVehiculos/ModalVehiculosRelacion";
import ModalTiposProductoRelacion from "../components/PublicosConVehiculos/ModalProdcutosRelacion";
import SelectorModal from "../components/SelectorModal";
import { Users, Target, Filter, Truck, Package } from 'lucide-react';

export default function PublicosPage() {
  const [publicos, setPublicos] = useState([]);
  const [selectedPublico, setSelectedPublico] = useState(null);
  const [selectedModal, setSelectedModal] = useState(null); // 'vehiculos' | 'tipos-producto'
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

  const handleSelectPublico = (publico) => {
    setSelectedPublico(publico);
    setSelectedModal(null); // Reset para mostrar el selector
  };
  const handleCloseModal = () => {
    setSelectedPublico(null);
    setSelectedModal(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Título actualizado */}
      <div className="flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700/50 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl shadow-lg shadow-purple-500/50">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
              Públicos Objetivo
            </h1>
            <p className="text-lg text-gray-400 mt-2 font-medium">
              Gestiona las relaciones con vehículos publicitarios y tipos de producto
            </p>
          </div>
        </div>
        <div className="text-right max-w-md">
          <p className="text-sm text-gray-300 bg-gray-700/50 px-4 py-2 rounded-lg border border-gray-600/50 shadow-sm">
            <span className="font-semibold text-purple-400">💡</span> Selecciona un público para gestionar sus relaciones
          </p>
        </div>
      </div>

      {/* Indicador de estado */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
          <span className="text-sm font-medium text-gray-300">
            {loading ? 'Cargando públicos...' : `${publicos.length} públicos encontrados`}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Filter className="h-4 w-4" />
          <span>Selecciona un público para ver detalles</span>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-3xl shadow-2xl border border-gray-700/50 backdrop-blur-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-200">Cargando públicos objetivo</p>
              <p className="text-sm text-gray-400 mt-1">Estamos preparando tu información...</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-sm"></div>
            <div className="relative bg-gray-800/30 rounded-2xl border border-gray-700/50 shadow-inner">
              <PublicosTable data={publicos} onSelect={handleSelectPublico} />
            </div>
          </div>
        )}
      </div>

      {/* Selector de modal */}
      <SelectorModal
        publico={selectedPublico}
        isOpen={!!selectedPublico && !selectedModal}
        onSelectModal={setSelectedModal}
        onClose={handleCloseModal}
      />

      {/* Modal de vehículos */}
      <ModalVehiculosRelacion
        publico={selectedPublico}
        isOpen={selectedModal === 'vehiculos'}
        onClose={handleCloseModal}
      />

      {/* Modal de tipos de producto */}
      <ModalTiposProductoRelacion
        publico={selectedPublico}
        isOpen={selectedModal === 'tipos-producto'}
        onClose={handleCloseModal}
      />
    </div>
  );
}