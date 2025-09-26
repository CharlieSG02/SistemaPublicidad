import  Table  from '../common/Table'

export function VehiculosTable({ data, onSelect }) {
    const columns = [
        {
            header: "ID",
            accessorKey: "cod_vehiculo",
        },
        {
            header: "Descripcion",
            accessorKey: "descripcion",
        },
        {
            header: "Contenido",
            accessorKey: "contenido",
        },
        {
            header: "Horario",
            accessorKey: "horario",
        },
        {
            header: "Hora Inicio",
            accessorKey: "hora_inicio",
        },
        {
            header: "Hora Fin",
            accessorKey: "hora_fin",
        }
    ];

    return (
        <Table
            data={data}
            columns={columns}
            onSelect={onSelect}
            enableFilters={true}
            enableSorting={true}
        />
    );

}