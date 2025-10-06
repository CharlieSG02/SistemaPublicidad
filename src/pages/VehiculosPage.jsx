// pages/vehiculos.jsx
import { useEffect, useState } from "react";
import { Truck, MapPin, Filter, Users } from 'lucide-react';
import { vehiculosAPI } from "../lib/crudVehiculosAPI";
import { VehiculosTable } from "../components/Vehiculos/VehiculosTable";
import ModalEspaciosRelacion from "../components/Vehiculos/ModalEspaciosRelacion";
import ModalPublicosRelacion from "../components/Vehiculos/ModalPublicosRelacion";

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [selectedModal, setSelectedModal] = useState(null); // 'espacios' | 'publicos'
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
              Gestiona espacios publicitarios y públicos objetivo
            </p>
          </div>
        </div>
        <div className="text-right max-w-md">
          <p className="text-sm text-gray-500 bg-white/80 px-4 py-2 rounded-lg border border-gray-200/50 shadow-sm">
            <span className="font-semibold text-orange-600">💡</span> Selecciona un vehículo para gestionar sus relaciones
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
              <VehiculosTable data={vehiculos} onSelect={setSelectedVehiculo} />
            </div>
          </div>
        )}
      </div>

      {/* Selector Modal - Elegir qué gestionar */}
      {selectedVehiculo && !selectedModal && (
        <SelectorModalVehiculo
          vehiculo={selectedVehiculo}
          isOpen={!!selectedVehiculo && !selectedModal}
          onSelectModal={setSelectedModal}
          onClose={() => {
            setSelectedVehiculo(null);
            setSelectedModal(null);
          }}
        />
      )}

      {/* Modal de Espacios Publicitarios */}
      <ModalEspaciosRelacion
        vehiculo={selectedVehiculo}
        isOpen={selectedModal === 'espacios'}
        onClose={() => {
          setSelectedVehiculo(null);
          setSelectedModal(null);
        }}
      />

      {/* Modal de Públicos Objetivo */}
      <ModalPublicosRelacion
        vehiculo={selectedVehiculo}
        isOpen={selectedModal === 'publicos'}
        onClose={() => {
          setSelectedVehiculo(null);
          setSelectedModal(null);
        }}
      />
    </div>
  );
}

// Componente Selector Modal para Vehículos
function SelectorModalVehiculo({ vehiculo, isOpen, onSelectModal, onClose }) {
  if (!isOpen) return null;

  const options = [
    {
      key: 'espacios',
      title: 'Espacios Publicitarios',
      description: 'Consulta los espacios publicitarios de este vehículo',
      icon: MapPin,
      color: 'from-blue-500 to-blue-600'
    },
    {
      key: 'publicos',
      title: 'Públicos Objetivo',
      description: 'Gestiona los públicos objetivo asociados a este vehículo',
      icon: Users,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Gestionar: <span className="text-orange-600">{vehiculo?.descripcion}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>

        {/* Opciones */}
        <div className="p-6 space-y-4">
          {options.map((option) => (
            <button
              key={option.key}
              onClick={() => onSelectModal(option.key)}
              className="w-full p-4 text-left rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${option.color}`}>
                  <option.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{option.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}