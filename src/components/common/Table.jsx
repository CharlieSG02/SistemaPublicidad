// components/Common/Table.jsx
import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function Table({
  data,
  columns,
  onSelect
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-xl shadow-lg overflow-hidden border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b border-blue-400 px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
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
                  cursor-pointer transform hover:scale-[1.01]
                `}
                onClick={() => onSelect?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 text-sm text-gray-700 font-medium whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estado vacío */}
      {table.getRowModel().rows.length === 0 && (
        <div className="text-center py-12 bg-gray-50">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <p className="text-gray-500 text-lg font-medium">No hay datos disponibles</p>
          <p className="text-gray-400 text-sm">Los registros aparecerán aquí</p>
        </div>
      )}
    </div>
  );
}