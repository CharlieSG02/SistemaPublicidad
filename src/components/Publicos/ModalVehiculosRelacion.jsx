
// components/Publicos/ModalVehiculosRelacion.jsx
import { useEffect, useState } from "react";
import { publicoVehiculosAPI } from "../../lib/crudPublicoVehiculosAPI";
import Modal from "../Modal";
import VehiculoFilters from "./VehiculoFilters";

export default function ModalVehiculosRelacion({ publico, isOpen, onClose }) {
  const [vehiculosRelacionados, setVehiculosRelacionados] = useState([]);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
  const [filters, setFilters] = useState({});

  // Estados para selección múltiple
  const [selectedAvailable, setSelectedAvailable] = useState(new Set());
  const [selectedRelated, setSelectedRelated] = useState(new Set());
  const [loadingBulk, setLoadingBulk] = useState(false);

  // 🔹 Resetear filtros y estados SOLO cuando cambia el público
  useEffect(() => {
    if (!publico) return;

    setFilters({});
    setSelectedAvailable(new Set());
    setSelectedRelated(new Set());
    setVehiculosRelacionados([]);
    setVehiculosDisponibles([]);

    const fetchInitial = async () => {
      const relacionados = await publicoVehiculosAPI.getVehiculosByPublico(
        publico.cod_publico_objetivo
      );
      const disponibles = await publicoVehiculosAPI.getVehiculosDisponibles(
        publico.cod_publico_objetivo,
        {}
      );
      setVehiculosRelacionados(relacionados);
      setVehiculosDisponibles(disponibles);
    };

    fetchInitial();
  }, [publico]);

  // 🔹 Volver a consultar SOLO cuando cambian los filtros
  useEffect(() => {
    if (!publico) return;

    const fetchFiltered = async () => {
      const disponibles = await publicoVehiculosAPI.getVehiculosDisponibles(
        publico.cod_publico_objetivo,
        filters
      );
      setVehiculosDisponibles(disponibles);
    };

    fetchFiltered();
  }, [filters, publico]);

  // toggle checkbox
  const toggleAvailable = (id) => {
    setSelectedAvailable((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const toggleRelated = (id) => {
    setSelectedRelated((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const handleBulkAdd = async () => {
    if (!publico) return;
    const ids = Array.from(selectedAvailable);
    if (ids.length === 0) return;

    try {
      setLoadingBulk(true);
      await publicoVehiculosAPI.bulkAdd(publico.cod_publico_objetivo, ids);

      const [rel, dis] = await Promise.all([
        publicoVehiculosAPI.getVehiculosByPublico(publico.cod_publico_objetivo),
        publicoVehiculosAPI.getVehiculosDisponibles(publico.cod_publico_objetivo, filters),
      ]);
      setVehiculosRelacionados(rel);
      setVehiculosDisponibles(dis);
      setSelectedAvailable(new Set());
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBulk(false);
    }
  };

  const handleBulkRemove = async () => {
    if (!publico) return;
    const ids = Array.from(selectedRelated);
    if (ids.length === 0) return;

    try {
      setLoadingBulk(true);
      await publicoVehiculosAPI.bulkRemove(publico.cod_publico_objetivo, ids);

      const [rel, dis] = await Promise.all([
        publicoVehiculosAPI.getVehiculosByPublico(publico.cod_publico_objetivo),
        publicoVehiculosAPI.getVehiculosDisponibles(publico.cod_publico_objetivo, filters),
      ]);
      setVehiculosRelacionados(rel);
      setVehiculosDisponibles(dis);
      setSelectedRelated(new Set());
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBulk(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Gestionar vehículos - Público: ${publico?.interes}`}
      className="max-w-6xl p-6"
    >
      <div className="grid grid-cols-3 gap-6">
        {/* Columna 1 - Público */}
        <div className="bg-gray-50 p-4 rounded-lg border space-y-2">
          <h3 className="font-bold text-lg">Público seleccionado</h3>
          <p><strong>Interés:</strong> {publico?.interes}</p>
          <p><strong>Edad:</strong> {publico?.rango_edad}</p>
          <p><strong>Sexo:</strong> {publico?.sexo}</p>
          <p><strong>NSE:</strong> {publico?.nivel_socioeconomico}</p>
          <p><strong>Educación:</strong> {publico?.nivel_educativo}</p>
        </div>

        {/* Columna 2 - Relacionados */}
        <div className="bg-gray-50 p-4 rounded-lg border space-y-2">
          <h3 className="font-bold text-lg">Vehículos relacionados</h3>

          {vehiculosRelacionados.length > 0 ? (
            <>
              <ul className="space-y-2 max-h-[400px] overflow-y-auto">
                {vehiculosRelacionados.map((v) => (
                  <li
                    key={v.cod_vehiculo}
                    className={`flex justify-between items-center p-2 border rounded bg-white cursor-pointer ${
                      selectedRelated.has(v.cod_vehiculo) ? "bg-red-100" : ""
                    }`}
                    onClick={() => toggleRelated(v.cod_vehiculo)}
                  >
                    <div>
                      <p className="font-semibold">{v.descripcion}</p>
                      <p className="text-xs text-gray-500">
                        {v.contenido} • {v.horario}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {selectedRelated.size > 0 && (
                <button
                  onClick={handleBulkRemove}
                  disabled={loadingBulk}
                  className="mt-2 w-full bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 disabled:opacity-50"
                >
                  Quitar seleccionados ({selectedRelated.size})
                </button>
              )}
            </>
          ) : (
            <p className="text-gray-500 italic">No hay vehículos relacionados.</p>
          )}
        </div>

        {/* Columna 3 - Disponibles con filtros */}
        <div className="bg-gray-50 p-4 rounded-lg border space-y-2">
          <h3 className="font-bold text-lg">Agregar vehículos</h3>

          <VehiculoFilters onFilterChange={setFilters} />

          <ul className="space-y-2 max-h-[400px] overflow-y-auto">
            {vehiculosDisponibles.map((v) => (
              <li
                key={v.cod_vehiculo}
                className={`p-2 border rounded bg-white cursor-pointer ${
                  selectedAvailable.has(v.cod_vehiculo) ? "bg-blue-100" : ""
                }`}
                onClick={() => toggleAvailable(v.cod_vehiculo)}
              >
                <p className="font-semibold">{v.descripcion}</p>
                <p className="text-xs text-gray-500">
                  {v.contenido} • {v.horario}
                </p>
              </li>
            ))}
          </ul>

          {selectedAvailable.size > 0 && (
            <button
              onClick={handleBulkAdd}
              disabled={loadingBulk}
              className="mt-2 w-full bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              Agregar seleccionados ({selectedAvailable.size})
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

