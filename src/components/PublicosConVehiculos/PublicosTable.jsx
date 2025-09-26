// components/Publicos/PublicosTable.jsx
import Table from "../common/Table";

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

  return (
    <Table 
      data={data} 
      columns={columns} 
      onSelect={onSelect}
    />
  );
}