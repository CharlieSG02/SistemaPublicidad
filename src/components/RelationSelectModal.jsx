// components/RelationSelectModal.jsx
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { publicoVehiculosAPI } from "../lib/crudPublicoVehiculosAPI";

export default function RelationSelectModal({ isOpen, onClose, publico, onAdded }) {
  const [available, setAvailable] = useState([]);
  const [sel, setSel] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !publico) return;
    const load = async () => {
      try {
        const data = await publicoVehiculosAPI.getVehiculosDisponibles(publico.cod_publico_objetivo);
        setAvailable(data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [isOpen, publico]);

  const toggle = (id) => {
    const s = new Set(sel);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSel(s);
  };

  const handleAdd = async () => {
    if (sel.size === 0) return alert("Seleccione al menos 1 vehículo");
    setLoading(true);
    try {
      // Usar bulkAdd para agregar múltiples vehículos de una vez
      await publicoVehiculosAPI.bulkAdd(publico.cod_publico_objetivo, Array.from(sel));
      onAdded();
    } catch (err) {
      console.error(err);
      alert("Error agregando relación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Agregar vehículo(s) a ${publico?.sexo} ${publico?.rango_edad}`}>
      <div className="space-y-3">
        {available.length === 0 ? (
          <p className="text-gray-500">No hay vehículos disponibles para agregar.</p>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {available.map((v) => (
              <label key={v.cod_vehiculo} className="flex items-center gap-3 p-3 border rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={sel.has(v.cod_vehiculo)}
                  onChange={() => toggle(v.cod_vehiculo)}
                />
                <div>
                  <div className="font-semibold">{v.descripcion}</div>
                  <div className="text-xs text-gray-500">{v.horario}</div>
                </div>
              </label>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded border">Cancelar</button>
          <button onClick={handleAdd} disabled={loading} className="px-3 py-1 rounded bg-blue-600 text-white">
            {loading ? "Agregando..." : "Agregar seleccionados"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
