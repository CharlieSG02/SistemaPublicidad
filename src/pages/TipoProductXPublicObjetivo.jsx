import { useEffect, useState } from "react";
import Table from "../components/Table";
import { productoXPublicoAPI } from "../lib/crudProductoXPublicoAPI";


export default function ProductoXPublicoPage ()  {
  const { getOnlyWithRelations } = productoXPublicoAPI;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const productosConPublicos = await getOnlyWithRelations();

      console.log("Datos desde API:", productosConPublicos); // Para debug

      // Ya vienen agrupados por producto, solo asignamos directamente
      setData(productosConPublicos);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "ID Producto",
      accessorKey: "id"
    },
    {
      header: "Producto",
      accessorKey: "tipo_producto",
      cell: ({ getValue, row }) => {
        const p = getValue();
        return (
          <div>
            <b>{p?.rubro}</b> • {p?.familia} • {p?.clase}
            <div className="text-xs text-gray-500">
              {row.original.publicos_objetivo?.length || 0} públicos relacionados
            </div>
          </div>
        );
      },
    },
    {
      header: "Públicos Objetivo Relacionados",
      accessorKey: "publicos_objetivo",
      cell: ({ getValue }) => {
        const publicos = getValue() || [];
        return (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {publicos.length > 0 ? (
              publicos.map((po, index) => (
                <div
                  key={`${po.cod_publico_objetivo}-${index}`}
                  className="text-sm border-l-2 border-blue-500 pl-2 py-1"
                >
                  <span className="font-medium">{po?.sexo}</span> • {po?.rango_edad} • {po?.interes}
                  • {po?.nivel_socioeconomico} • {po?.nivel_educativo} • {po?.estado_civil}
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
      <h1 className="text-2xl font-bold">Relaciones Producto - Público</h1>
      <div className="bg-blue-50 p-4 rounded">
        <p className="text-sm text-blue-800">
          Mostrando <strong>{data.length}</strong> productos distintos con sus públicos objetivos relacionados
        </p>
      </div>
      <Table data={data} columns={columns} />

    </div>
  );
}