// components/RelationsTable.jsx
import Table from "./Table";
import { Trash } from "lucide-react";

export default function RelationsTable({ relations = [], onRemove, loadingRemove }) {
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      cell: info => <div className="text-sm">{info.getValue()}</div>
    },
    {
      header: "Vehículo",
      accessorKey: "vehiculo",
      cell: ({ getValue }) => {
        const v = getValue() || {};
        return (
          <div>
            <div className="font-semibold">{v.descripcion}</div>
            <div className="text-xs text-gray-500">{v.horario}</div>
          </div>
        );
      }
    },
    {
      header: "Acciones",
      accessorKey: "acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => onRemove(row.original.id)}
            disabled={loadingRemove}
            className="px-2 py-1 rounded bg-red-600 text-white text-sm inline-flex items-center gap-2"
          >
            <Trash size={14} /> Quitar
          </button>
        </div>
      )
    }
  ];

  return <Table data={relations} columns={columns} />;
}
