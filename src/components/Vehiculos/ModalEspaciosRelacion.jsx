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
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-lg text-blue-800">Vehículo Publicitario</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Descripción:</strong> {vehiculo?.descripcion}</p>
              <p><strong>Contenido:</strong> {vehiculo?.contenido}</p>
            </div>
            <div>
              <p><strong>Horario:</strong> {vehiculo?.horario}</p>
              <p><strong>Horas:</strong> {vehiculo?.hora_inicio} - {vehiculo?.hora_fin}</p>
            </div>
          </div>
        </div>

        {/* Lista de Espacios */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-800">
              Espacios Publicitarios Relacionados
              {espacios.length > 0 && (
                <span className="ml-2 bg-green-500 text-white text-sm px-2 py-1 rounded-full">
                  {espacios.length} espacios
                </span>
              )}
            </h3>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-2">Cargando espacios...</p>
            </div>
          ) : espacios.length > 0 ? (
            <div className="grid gap-4">
              {espacios.map((espacio) => (
                <div
                  key={espacio.cod_espacio}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-lg text-gray-900">
                      {espacio.descripcion}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      espacio.prioridad === 1 ? 'bg-red-100 text-red-800' :
                      espacio.prioridad === 2 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      Prioridad {espacio.prioridad}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span><strong>Medio:</strong> {espacio.medio}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <span><strong>Audiencia:</strong> {espacio.audiencia_promedio.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-yellow-500" />
                      <span><strong>Precio:</strong> ${espacio.precio_x_unidad}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span><strong>Día:</strong> {espacio.dia}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500 space-y-1">
                    <p><strong>Unidad de alquiler:</strong> {espacio.unidad_alquiler}</p>
                    <p><strong>Alcance geográfico:</strong> {espacio.alcance_geografico}</p>
                    <p><strong>Categoría:</strong> {espacio.categoria}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No hay espacios publicitarios relacionados</p>
              <p className="text-gray-500 text-sm mt-1">Este vehículo no tiene espacios asignados</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}