// components/Publicos/PublicosTable.jsx
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

export function PublicosTable({ data, onSelect }) {
  const columns = [
    {
      header: "ID",
      accessorKey: "cod_publico_objetivo",
    },
    {
      header: "Sexo",
      accessorKey: "sexo",
    },
    {
      header: "NSE",
      accessorKey: "nivel_socioeconomico",
    },
    {
      header: "Educación",
      accessorKey: "nivel_educativo",
    },
    {
      header: "Edad",
      accessorKey: "rango_edad",
    },
    {
      header: "Interés",
      accessorKey: "interes",
    },
    {
      header: "Estado Civil",
      accessorKey: "estado_civil",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead className="bg-gray-100">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700"
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className="cursor-pointer hover:bg-blue-50"
            onClick={() => onSelect(row.original)}
          >
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className="border border-gray-300 px-4 py-2 text-sm text-gray-600"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
