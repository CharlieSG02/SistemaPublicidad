// components/VehiculosConEspacios/ModalEspaciosRelacion.jsx
import Modal from "../Modal";
import { useEffect, useState } from "react";
import { Target, MapPin, Clock, DollarSign, Users } from 'lucide-react';
import { espaciosAPI } from "../../lib/crudEspaciosAPI";

export default function ModalEspaciosRelacion({ vehiculo, isOpen, onClose }) {
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!vehiculo) return;

    const fetchEspacios = async () => {
      try {
        setLoading(true);
        const data = await espaciosAPI.getByVehiculo(vehiculo.cod_vehiculo);
        setEspacios(data);
      } catch (error) {
        console.error("Error cargando espacios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEspacios();
  }, [vehiculo]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Espacios Publicitarios - ${vehiculo?.descripcion}`}
      className="max-w-4xl"
    >
      <div className="p-6">
        {/* Información del Vehículo */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700/50 mb-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-lg bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Vehículo Publicitario</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="space-y-1">
              <p><strong className="text-white">Descripción:</strong> {vehiculo?.descripcion}</p>
              <p><strong className="text-white">Contenido:</strong> {vehiculo?.contenido}</p>
            </div>
            <div className="space-y-1">
              <p><strong className="text-white">Horario:</strong> {vehiculo?.horario}</p>
              <p><strong className="text-white">Horas:</strong> {vehiculo?.hora_inicio} - {vehiculo?.hora_fin}</p>
            </div>
          </div>
        </div>

        {/* Lista de Espacios */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-white">
              Espacios Publicitarios Relacionados
              {espacios.length > 0 && (
                <span className="ml-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm px-3 py-1 rounded-full shadow-lg">
                  {espacios.length} espacios
                </span>
              )}
            </h3>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-400 mt-2">Cargando espacios...</p>
            </div>
          ) : espacios.length > 0 ? (
            <div className="grid gap-4">
              {espacios.map((espacio) => (
                <div
                  key={espacio.cod_espacio}
                  className="bg-gray-700/30 border border-gray-600/50 rounded-xl p-4 hover:bg-gray-700/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-lg text-white">
                      {espacio.descripcion}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg ${
                      espacio.prioridad === 1 ? 'bg-red-600/30 text-red-300 border border-red-500/50' :
                      espacio.prioridad === 2 ? 'bg-yellow-600/30 text-yellow-300 border border-yellow-500/50' :
                      'bg-green-600/30 text-green-300 border border-green-500/50'
                    }`}>
                      Prioridad {espacio.prioridad}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      <span><strong className="text-white">Medio:</strong> {espacio.medio}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-green-400" />
                      <span><strong className="text-white">Audiencia:</strong> {espacio.audiencia_promedio.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-yellow-400" />
                      <span><strong className="text-white">Precio:</strong> ${espacio.precio_x_unidad}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-purple-400" />
                      <span><strong className="text-white">Día:</strong> {espacio.dia}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-400 space-y-1 bg-gray-800/30 p-3 rounded-lg border border-gray-700/30">
                    <p><strong className="text-gray-300">Unidad de alquiler:</strong> {espacio.unidad_alquiler}</p>
                    <p><strong className="text-gray-300">Alcance geográfico:</strong> {espacio.alcance_geografico}</p>
                    <p><strong className="text-gray-300">Categoría:</strong> {espacio.categoria}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-700/30 rounded-lg border border-gray-600/50">
              <MapPin className="h-12 w-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-300 font-medium">No hay espacios publicitarios relacionados</p>
              <p className="text-gray-400 text-sm mt-1">Este vehículo no tiene espacios asignados</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}