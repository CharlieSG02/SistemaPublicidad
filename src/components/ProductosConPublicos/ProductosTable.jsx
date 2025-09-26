// components/Publicos/PublicosTable.jsx
import Table from "../common/Table";

export function ProductosTable({ data, onSelect }) {
  const columns = [
    {
      header: "ID",
      accessorKey: "cod_tipo_producto",
    },
    {
      header: "Rubro",
      accessorKey: "rubro",
    },
    {
      header: "Familia",
      accessorKey: "familia",
    },
    {
      header: "Clase",
      accessorKey: "clase",
    }
  ];

  return (
    <Table 
      data={data} 
      columns={columns} 
      onSelect={onSelect}
    />
  );
}