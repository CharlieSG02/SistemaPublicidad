import { useEffect, useState } from "react";
import Table from "../components/Table";
import { publicoXProductoAPI } from "../lib/crudPublicoXProductoAPI";


export const  PublicoXProductoPage =()=> {
  const {getOnlyWithRelations} = publicoXProductoAPI;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const publicosConProductos = await getOnlyWithRelations();

      console.log("Datos desde API:", publicosConProductos); // Para debug

      // Ya vienen agrupados por producto, solo asignamos directamente
      setData(publicosConProductos);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "ID Publico",
      accessorKey: "id"
    },
    {
      header: "Publico",
      accessorKey: "publico_objetivo",
      cell: ({ getValue, row }) => {
        const p = getValue();
        return (
          <div>
            <b>{p?.sexo}</b> • {p?.rango_edad} • {p?.interes}
            <div className="text-xs text-gray-500">
              {row.original.tipos_productos?.length || 0} productos relacionados
            </div>
          </div>
        );
      },
    },
    {
      header: "Tipos Productos Relacionados",
      accessorKey: "tipos_productos",
      cell: ({ getValue }) => {
        const productos = getValue() || [];
        return (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {productos.length > 0 ? (
              productos.map((po, index) => (
                <div
                  key={`${po.cod_tipo_producto}-${index}`}
                  className="text-sm border-l-2 border-blue-500 pl-2 py-1"
                >
                  <span className="font-medium">{po?.rubro}</span> • {po?.familia} • {po?.clase}
                </div>
              ))
            ) : (
              <span className="text-gray-400 italic">No existe relación alguna</span>
            )}
          </div>
        );
      },
    },

  ];

  if (loading) {
    return <div className="flex justify-center p-8">Cargando...</div>;
  }



  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Relaciones Público - Productos</h1>
      <div className="bg-blue-50 p-4 rounded">
        <p className="text-sm text-blue-800">
          Mostrando <strong>{data.length}</strong> publicos objetivos distintos con sus tipos de productoss relacionados
        </p>
      </div>
      <Table data={data} columns={columns} />
    </div>
  );
}