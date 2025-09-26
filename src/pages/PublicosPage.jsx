// pages/PublicosPage.jsx
import { useEffect, useState } from "react";
import { publicoAPI } from "../lib/crudPublicosAPI";
import { PublicosTable } from "../components/PublicosConVehiculos/PublicosTable";
import ModalVehiculosRelacion from "../components/PublicosConVehiculos/ModalVehiculosRelacion";

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
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Título */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Públicos Objetivo
        </h1>
        <p className="text-sm text-gray-500">
          Selecciona un público para ver o gestionar sus vehículos relacionados
        </p>
      </div>

      {/* Tabla */}
      <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200">
        {loading ? (
          <div className="text-center py-8 text-gray-500 italic">
            Cargando públicos...
          </div>
        ) : (
          <PublicosTable data={publicos} onSelect={setSelected} />
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
