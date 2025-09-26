// pages/vehiculos.jsx
import { useEffect, useState } from "react";
import { Truck, MapPin, Filter } from 'lucide-react';
import { vehiculosAPI } from "../lib/crudVehiculosAPI";
import { VehiculosTable } from "../components/Vehiculos/VehiculosTable";
import ModalEspaciosRelacion from "../components/Vehiculos/ModalEspaciosRelacion";

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        setLoading(true);
        const data = await vehiculosAPI.getAll();
        setVehiculos(data);
      } catch (error) {
        console.error("Error cargando vehículos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehiculos();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Título */}
      <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200/50 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent tracking-tight">
              Vehículos Publicitarios
            </h1>
            <p className="text-lg text-gray-600 mt-2 font-medium">
              Consulta los espacios publicitarios de cada vehículo
            </p>
          </div>
        </div>
        <div className="text-right max-w-md">
          <p className="text-sm text-gray-500 bg-white/80 px-4 py-2 rounded-lg border border-gray-200/50 shadow-sm">
            <span className="font-semibold text-orange-600">💡</span> Selecciona un vehículo para ver sus espacios publicitarios
          </p>
        </div>
      </div>

      {/* Indicador de estado */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
          <span className="text-sm font-medium text-gray-600">
            {loading ? 'Cargando vehículos...' : `${vehiculos.length} vehículos encontrados`}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Filter className="h-4 w-4" />
          <span>Selecciona un vehículo para ver detalles</span>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-gradient-to-br from-white to-gray-50/50 p-6 rounded-3xl shadow-xl border border-gray-200/30 backdrop-blur-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">Cargando vehículos</p>
              <p className="text-sm text-gray-500 mt-1">Estamos preparando tu información...</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-3xl blur-sm"></div>
            <div className="relative bg-white/80 rounded-2xl border border-white/50 shadow-inner">
              <VehiculosTable data={vehiculos} onSelect={setSelected} />
            </div>
          </div>
        )}
      </div>

      {/* Modal de espacios (solo lectura) */}
      <ModalEspaciosRelacion
        vehiculo={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}