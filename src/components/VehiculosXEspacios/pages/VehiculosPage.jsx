import { useEffect, useState } from "react";
import { vehiculosAPI } from "../../../lib/crudVehiculosAPI";
import { espaciosAPI } from "../../../lib/crudEspaciosAPI";
import { VehiculosList } from "../VehiculosList";
import ModalEspacios from "../../../components/VehiculosXEspacios/ModalEspacios";

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null); // vehiculo seleccionado
  const [espacios, setEspacios] = useState([]);

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const data = await vehiculosAPI.getAll();
        setVehiculos(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los vehículos");
      } finally {
        setLoading(false);
      }
    };

    fetchVehiculos();
  }, []);

  useEffect(() => {
    const fetchEspacios = async () => {
      if (!selected) return;
      try {
        const data = await espaciosAPI.getByVehiculo(selected.cod_vehiculo);
        setEspacios(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los espacios publicitarios");
      }
    };

    fetchEspacios();
  }, [selected]);

  if (loading) return <p className="text-center text-lg animate-pulse">Cargando vehículos...</p>;
  if (error) return <p className="text-center text-red-500 font-semibold">{error}</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-extrabold text-gray-900 text-center drop-shadow-sm">
        🚗 Vehículos Publicitarios
      </h1>

      {/* Lista de vehículos */}
      <VehiculosList vehiculos={vehiculos} onSelect={setSelected} />

      {/* Modal con los espacios */}
      <ModalEspacios
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={`Espacios disponibles en: ${selected?.descripcion}`}
      >
        {espacios.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {espacios.map((e) => (
              <div
                key={e.cod_espacio}
                className="p-4 border rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 shadow hover:shadow-lg transition duration-200"
              >
                <h3 className="font-bold text-indigo-700">{e.descripcion}</h3>
                <p className="text-sm text-gray-700 mt-1">
                  📡 Medio: <span className="font-medium">{e.medio}</span>
                </p>
                <p className="text-sm text-gray-700">
                  👥 Audiencia: <span className="font-medium">{e.audiencia_promedio}</span>
                </p>
                <p className="text-sm text-gray-700">
                  💲 {e.precio_x_unidad} / {e.unidad_alquiler}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  📅 {e.dia} • 🏷 {e.categoria}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-center">
            No hay espacios disponibles para este vehículo.
          </p>
        )}
      </ModalEspacios>
    </div>
  );
}
