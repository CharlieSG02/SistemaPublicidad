// components/EspaciosPublicitarios/EspaciosTable.jsx
import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Search, Filter, X, SlidersHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function EspaciosTable({
  data,
  enableFilters = true,
  enableSorting = true
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Definición de columnas específicas para espacios publicitarios
  const columns = [
    {
      accessorKey: "cod_espacio",
      header: "Código",
      enableColumnFilter: false,
      size: 100,
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      size: 200,
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <div className="min-h-[40px] flex items-center">
            <span className="text-xs leading-tight break-words">
              {value}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: "medio",
      header: "Medio",
      size: 120,
    },
    {
      accessorKey: "audiencia_promedio",
      header: "Audiencia",
      enableColumnFilter: false,
      size: 120,
      cell: ({ getValue }) => {
        const value = getValue();
        return value?.toLocaleString() || "0";
      }
    },
    {
      accessorKey: "unidad_alquiler",
      header: "Unidad Alquiler",
      size: 140,
    },
    {
      accessorKey: "precio_x_unidad",
      header: () => (
        <div className="text-center leading-tight">
          <div className="font-semibold">PRECIO</div>
          <div className="text-xs opacity-90">UNIDAD</div>
        </div>
      ),
      enableColumnFilter: false,
      size: 90,
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? `$${parseFloat(value).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00";
      }
    },
    {
      accessorKey: "alcance_geografico",
      header: "Alcance Geográfico",
      size: 150,
    },
    {
      accessorKey: "categoria",
      header: "CATEGORÍA",
      size: 40,
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <div className="flex items-center justify-center" style={{ width: '40px' }}>
            <span className="text-xs text-center break-words">
              {value}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: "dia",
      header: "Día",
      size: 100,
    },
    {
      accessorKey: "prioridad",
      header: "Prioridad",
      enableColumnFilter: false,
      size: 100,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
      sorting: enableSorting ? sorting : [],
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getPaginationRowModel: getPaginationRowModel(), // Agregar paginación
    globalFilterFn: "includesString",
    initialState: {
      pagination: {
        pageSize: 10, // Mostrar 10 registros por página
      },
    },
  });

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setGlobalFilter("");
    setColumnFilters([]);
    setSorting([]);
  };

  // Obtener columnas filtrables
  const filterableColumns = columns.filter(col => col.enableColumnFilter !== false);

  return (
    <div className="rounded-xl shadow-lg overflow-hidden border border-gray-200 bg-white">
      {/* Header con Filtros */}
      {enableFilters && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          {/* Búsqueda Global */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar en todos los campos..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filtros</span>
                {(globalFilter || columnFilters.length > 0) && (
                  <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {columnFilters.length + (globalFilter ? 1 : 0)}
                  </span>
                )}
              </button>

              {(globalFilter || columnFilters.length > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Limpiar</span>
                </button>
              )}
            </div>
          </div>

          {/* Filtros por Columna */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-gray-200">
              {filterableColumns.map((column) => (
                <div key={column.accessorKey || column.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {column.header}
                  </label>
                  <input
                    type="text"
                    placeholder={`Filtrar por ${column.header}`}
                    value={(columnFilters.find(f => f.id === column.accessorKey)?.value) || ""}
                    onChange={(e) => {
                      const filterValue = e.target.value;
                      if (filterValue) {
                        setColumnFilters(prev =>
                          prev.filter(f => f.id !== column.accessorKey).concat({
                            id: column.accessorKey,
                            value: filterValue
                          })
                        );
                      } else {
                        setColumnFilters(prev => prev.filter(f => f.id !== column.accessorKey));
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Información de resultados */}
      {enableFilters && (
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Mostrando {table.getRowModel().rows.length} de {data.length} registros
              {data.length > 10 && (
                <span className="ml-2">
                  (Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()})
                </span>
              )}
            </span>
            {(globalFilter || columnFilters.length > 0) && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Filtros activos
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b border-blue-400 px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-blue-600 transition-colors"
                    onClick={enableSorting ? header.column.getToggleSortingHandler() : undefined}
                    style={{ width: header.column.columnDef.size }}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                      {enableSorting && (
                        <span className="ml-2">
                          {{
                            asc: '↑',
                            desc: '↓',
                          }[header.column.getIsSorted()] ?? '↕'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={`
                  transition-all duration-200 ease-in-out
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50
                `}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-2 py-2 text-xs text-gray-700 font-medium break-words align-top"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {table.getPageCount() > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Información de la página */}
            <div className="text-sm text-gray-600">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
              {" • "}
              Registros {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                data.length
              )} de {data.length}
            </div>

            {/* Controles de paginación */}
            <div className="flex items-center gap-2">
              {/* Botón Primera Página */}
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="p-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                title="Primera página"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>

              {/* Botón Página Anterior */}
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                title="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Selector de página */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Página</span>
                <input
                  type="number"
                  min="1"
                  max={table.getPageCount()}
                  value={table.getState().pagination.pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                    table.setPageIndex(Math.max(0, Math.min(page, table.getPageCount() - 1)));
                  }}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                />
                <span className="text-sm text-gray-600">de {table.getPageCount()}</span>
              </div>

              {/* Botón Página Siguiente */}
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                title="Página siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Botón Última Página */}
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="p-2 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                title="Última página"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>

            {/* Selector de tamaño de página */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Mostrar</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600">registros</span>
            </div>
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {table.getRowModel().rows.length === 0 && (
        <div className="text-center py-12 bg-gray-50">
          <div className="text-gray-400 text-6xl mb-4">
            {globalFilter || columnFilters.length > 0 ? '🔍' : '📊'}
          </div>
          <p className="text-gray-500 text-lg font-medium">
            {globalFilter || columnFilters.length > 0
              ? 'No se encontraron espacios publicitarios'
              : 'No hay espacios publicitarios disponibles'
            }
          </p>
          <p className="text-gray-400 text-sm">
            {globalFilter || columnFilters.length > 0
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Los espacios publicitarios aparecerán aquí'
            }
          </p>
          {(globalFilter || columnFilters.length > 0) && (
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}