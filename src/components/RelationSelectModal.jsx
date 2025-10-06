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
      <div className="space-y-4">
        {available.length === 0 ? (
          <div className="text-center py-8 bg-gray-700/30 rounded-lg border border-gray-600/50">
            <p className="text-gray-400">No hay vehículos disponibles para agregar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
            {available.map((v) => (
              <label 
                key={v.cod_vehiculo} 
                className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                  sel.has(v.cod_vehiculo)
                    ? 'border-blue-500/50 bg-blue-900/30 hover:bg-blue-900/40'
                    : 'border-gray-600/50 bg-gray-700/30 hover:bg-gray-700/50 hover:border-purple-500/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={sel.has(v.cod_vehiculo)}
                  onChange={() => toggle(v.cod_vehiculo)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex-1">
                  <div className="font-semibold text-white">{v.descripcion}</div>
                  <div className="text-xs text-gray-400 mt-1">{v.horario}</div>
                </div>
              </label>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-700/50">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-xl border border-gray-600 bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200"
          >
            Cancelar
          </button>
          <button 
            onClick={handleAdd} 
            disabled={loading || sel.size === 0} 
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-blue-500/50 hover:scale-105"
          >
            {loading ? "Agregando..." : `Agregar seleccionados (${sel.size})`}
          </button>
        </div>
      </div>
    </Modal>
  );
}
