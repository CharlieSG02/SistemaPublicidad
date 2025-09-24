export const EspaciosList = ({ espacios, vehiculo }) => {
  if (!espacios || espacios.length === 0) {
    return (
      <p className="text-gray-500">
        No hay espacios registrados para este vehículo.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">
        Espacios de: {vehiculo.descripcion}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {espacios.map((e) => (
          <div
            key={e.cod_espacio}
            className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
          >
            <h3 className="font-semibold">{e.descripcion}</h3>
            <p className="text-sm text-gray-600">
              {e.medio} • {e.categoria} • {e.dia}
            </p>
            <p className="text-sm text-gray-500">
              Audiencia: {e.audiencia_promedio} | Precio: {e.precio_x_unidad}/
              {e.unidad_alquiler}
            </p>
            <p className="text-xs text-gray-400">
              Alcance: {e.alcance_geografico}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
