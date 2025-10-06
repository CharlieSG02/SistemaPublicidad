// components/Common/ModalRelaciones.jsx
import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import {
  Target, CheckCircle, PlusCircle, MinusCircle,
  Trash2, Plus, FolderOpen
} from 'lucide-react';

export default function ModalRelaciones({
  entidadPrincipal,
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
      <div className="grid grid-cols-3 gap-4"> {/* 🔥 Gap y padding reducidos */}

        {/* Columna 1 - Entidad Principal */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700/50 shadow-xl">
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
              <Target className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{config.nombreEntidadPrincipal}</h3>
          </div>
          <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-600/50 text-sm text-gray-300">
            {config.renderEntidadPrincipal(entidadPrincipal)}
          </div>
        </div>

        {/* Columna 2 - Relacionados */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700/50 shadow-xl">
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-bold text-lg bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              {config.nombreEntidadRelacionada} relacionados
              {relacionados.length > 0 && (
                <span className="ml-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-2 py-0.5 rounded-full shadow-lg">
                  {relacionados.length}
                </span>
              )}
            </h3>
          </div>

          {relacionados.length > 0 ? (
            <>
              <ul className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {relacionados.filter(item => item != null).map((item) => (
                  <li
                    key={item[config.idKeyRelacionada]}
                    className={`p-2 border rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.01] text-sm ${selectedRelated.has(item[config.idKeyRelacionada])
                      ? "border-red-500/50 bg-red-900/30 hover:bg-red-900/40"
                      : "border-gray-600/50 bg-gray-700/30 hover:bg-gray-700/50 hover:border-green-500/50"
                      }`}
                    onClick={() => toggleRelated(item[config.idKeyRelacionada])}
                  >
                    <div className="flex items-center justify-between">
                      {config.renderItemRelacionada(item)}
                      {selectedRelated.has(item[config.idKeyRelacionada]) && (
                        <MinusCircle className="h-4 w-4 text-red-400 flex-shrink-0 ml-1" />
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {selectedRelated.size > 0 && (
                <button
                  onClick={handleBulkRemove}
                  disabled={loadingBulk}
                  className="mt-3 w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 px-3 rounded-xl font-medium hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm flex items-center justify-center space-x-1 shadow-lg hover:shadow-red-500/50 hover:scale-105"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>{loadingBulk ? 'Quitando...' : config.textoBotonRemover(selectedRelated.size)}</span>
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
              <FolderOpen className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No hay {config.nombreEntidadRelacionada} relacionados.</p>
            </div>
          )}
        </div>

        {/* Columna 3 - Disponibles */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700/50 shadow-xl">
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg shadow-lg">
              <PlusCircle className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-bold text-lg bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Agregar {config.nombreEntidadRelacionada}</h3>
          </div>

          {/* Filtros personalizados */}
          {config.FiltersComponent && (
            <div className="mb-3 p-2 bg-gray-700/30 rounded-lg border border-gray-600/50 text-sm">
              <config.FiltersComponent onFilterChange={setFilters} />
            </div>
          )}

          <ul className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
            {disponibles.filter(item => item != null).map((item) => (
              <li
                key={item[config.idKeyRelacionada]}
                className={`p-2 border rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.01] text-sm ${selectedAvailable.has(item[config.idKeyRelacionada])
                  ? "border-blue-500/50 bg-blue-900/30 hover:bg-blue-900/40"
                  : "border-gray-600/50 bg-gray-700/30 hover:bg-gray-700/50 hover:border-purple-500/50"
                  }`}
                onClick={() => toggleAvailable(item[config.idKeyRelacionada])}
              >
                <div className="flex items-center justify-between">
                  {config.renderItemDisponible(item)}
                  {selectedAvailable.has(item[config.idKeyRelacionada]) && (
                    <PlusCircle className="h-4 w-4 text-blue-400 flex-shrink-0 ml-1" />
                  )}
                </div>
              </li>
            ))}
          </ul>

          {selectedAvailable.size > 0 && (
            <button
              onClick={handleBulkAdd}
              disabled={loadingBulk}
              className="mt-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm flex items-center justify-center space-x-1 shadow-lg hover:shadow-purple-500/50 hover:scale-105"
            >
              <Plus className="h-3 w-3" />
              <span>{loadingBulk ? 'Agregando...' : config.textoBotonAgregar(selectedAvailable.size)}</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}