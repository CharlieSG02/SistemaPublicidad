// components/Common/ModalRelaciones.jsx
import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import {
  Target, CheckCircle, PlusCircle, MinusCircle,
  Trash2, Plus, FolderOpen
} from 'lucide-react';

export default function ModalRelaciones({
  entidadPrincipal,
  entidadRelacionada,
  isOpen,
  onClose,
  // APIs
  apiGetRelacionados,
  apiGetDisponibles,
  apiBulkAdd,
  apiBulkRemove,
  // Configuración
  config,
}) {
  const [relacionados, setRelacionados] = useState([]);
  const [disponibles, setDisponibles] = useState([]);
  const [filters, setFilters] = useState({});

  // Estados para selección múltiple
  const [selectedAvailable, setSelectedAvailable] = useState(new Set());
  const [selectedRelated, setSelectedRelated] = useState(new Set());
  const [loadingBulk, setLoadingBulk] = useState(false);

  // 🔹 Resetear estados cuando cambia la entidad principal
  useEffect(() => {
    if (!entidadPrincipal) return;

    setFilters({});
    setSelectedAvailable(new Set());
    setSelectedRelated(new Set());
    setRelacionados([]);
    setDisponibles([]);

    const fetchInitial = async () => {
      const [rel, dis] = await Promise.all([
        apiGetRelacionados(entidadPrincipal[config.idKey]),
        apiGetDisponibles(entidadPrincipal[config.idKey], {}),
      ]);
      setRelacionados(rel);
      setDisponibles(dis);
    };

    fetchInitial();
  }, [entidadPrincipal, apiGetRelacionados, apiGetDisponibles, config.idKey]);

  // 🔹 Volver a consultar cuando cambian los filtros
  useEffect(() => {
    if (!entidadPrincipal) return;

    const fetchFiltered = async () => {
      const dis = await apiGetDisponibles(entidadPrincipal[config.idKey], filters);
      setDisponibles(dis);
    };

    fetchFiltered();
  }, [filters, entidadPrincipal, apiGetDisponibles, config.idKey]);

  // Toggle checkboxes
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
    if (!entidadPrincipal) return;
    const ids = Array.from(selectedAvailable);
    if (ids.length === 0) return;

    try {
      setLoadingBulk(true);
      await apiBulkAdd(entidadPrincipal[config.idKey], ids);

      const [rel, dis] = await Promise.all([
        apiGetRelacionados(entidadPrincipal[config.idKey]),
        apiGetDisponibles(entidadPrincipal[config.idKey], filters),
      ]);
      setRelacionados(rel);
      setDisponibles(dis);
      setSelectedAvailable(new Set());
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBulk(false);
    }
  };

  const handleBulkRemove = async () => {
    if (!entidadPrincipal) return;
    const ids = Array.from(selectedRelated);
    if (ids.length === 0) return;

    try {
      setLoadingBulk(true);
      await apiBulkRemove(entidadPrincipal[config.idKey], ids);

      const [rel, dis] = await Promise.all([
        apiGetRelacionados(entidadPrincipal[config.idKey]),
        apiGetDisponibles(entidadPrincipal[config.idKey], filters),
      ]);
      setRelacionados(rel);
      setDisponibles(dis);
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
      title={config.titulo(entidadPrincipal)}
      className="max-w-6xl max-h-[90vh]" // 🔥 Reducido de 7xl a 6xl
    >
      <div className="grid grid-cols-3 gap-6 p-6"> {/* 🔥 Gap y padding reducidos */}

        {/* Columna 1 - Entidad Principal */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 shadow-lg">
          <div className="flex items-center space-x-2 mb-3"> {/* 🔥 Espacio reducido */}
            <div className="p-1.5 bg-blue-500 rounded-lg"> {/* 🔥 Icono más pequeño */}
              <Target className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-bold text-lg text-blue-800">{config.nombreEntidadPrincipal}</h3>
          </div>
          <div className="bg-white/80 p-3 rounded-lg border border-blue-100 text-sm"> {/* 🔥 Padding y texto reducido */}
            {config.renderEntidadPrincipal(entidadPrincipal)}
          </div>
        </div>

        {/* Columna 2 - Relacionados */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 shadow-lg">
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 bg-green-500 rounded-lg">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-bold text-lg text-green-800">
              {config.nombreEntidadRelacionada} relacionados
              {relacionados.length > 0 && (
                <span className="ml-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {relacionados.length}
                </span>
              )}
            </h3>
          </div>

          {relacionados.length > 0 ? (
            <>
              <ul className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar"> {/* 🔥 Altura reducida */}
                {relacionados.filter(item => item != null).map((item) => (
                  <li
                    key={item[config.idKeyRelacionada]}
                    className={`p-2 border rounded-lg bg-white/80 cursor-pointer transition-all duration-200 hover:scale-[1.01] text-sm ${selectedRelated.has(item[config.idKeyRelacionada])
                        ? "border-red-300 bg-red-50/80"
                        : "border-green-100 hover:border-green-200"
                      }`}
                    onClick={() => toggleRelated(item[config.idKeyRelacionada])}
                  >
                    <div className="flex items-center justify-between">
                      {config.renderItemRelacionada(item)}
                      {selectedRelated.has(item[config.idKeyRelacionada]) && (
                        <MinusCircle className="h-4 w-4 text-red-500 flex-shrink-0 ml-1" />
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {selectedRelated.size > 0 && (
                <button
                  onClick={handleBulkRemove}
                  disabled={loadingBulk}
                  className="mt-3 w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 px-3 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 disabled:opacity-50 transition-all duration-200 text-sm flex items-center justify-center space-x-1"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>{config.textoBotonRemover(selectedRelated.size)}</span>
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-4 bg-white/50 rounded-lg border border-green-100">
              <FolderOpen className="h-8 w-8 text-green-300 mx-auto mb-2" />
              <p className="text-green-600 text-sm">No hay {config.nombreEntidadRelacionada} relacionados.</p>
            </div>
          )}
        </div>

        {/* Columna 3 - Disponibles */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 shadow-lg">
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 bg-purple-500 rounded-lg">
              <PlusCircle className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-bold text-lg text-purple-800">Agregar {config.nombreEntidadRelacionada}</h3>
          </div>

          {/* Filtros personalizados */}
          {config.FiltersComponent && (
            <div className="mb-3 p-2 bg-white/80 rounded-lg border border-purple-100 text-sm">
              <config.FiltersComponent onFilterChange={setFilters} />
            </div>
          )}

          <ul className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
            {disponibles.filter(item => item != null).map((item) => (
              <li
                key={item[config.idKeyRelacionada]}
                className={`p-2 border rounded-lg bg-white/80 cursor-pointer transition-all duration-200 hover:scale-[1.01] text-sm ${selectedAvailable.has(item[config.idKeyRelacionada])
                    ? "border-blue-300 bg-blue-50/80"
                    : "border-purple-100 hover:border-purple-200"
                  }`}
                onClick={() => toggleAvailable(item[config.idKeyRelacionada])}
              >
                <div className="flex items-center justify-between">
                  {config.renderItemDisponible(item)}
                  {selectedAvailable.has(item[config.idKeyRelacionada]) && (
                    <PlusCircle className="h-4 w-4 text-blue-500 flex-shrink-0 ml-1" />
                  )}
                </div>
              </li>
            ))}
          </ul>

          {selectedAvailable.size > 0 && (
            <button
              onClick={handleBulkAdd}
              disabled={loadingBulk}
              className="mt-3 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all duration-200 text-sm flex items-center justify-center space-x-1"
            >
              <Plus className="h-3 w-3" />
              <span>{config.textoBotonAgregar(selectedAvailable.size)}</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}