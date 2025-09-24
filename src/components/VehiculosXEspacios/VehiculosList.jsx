export const VehiculosList = ({ vehiculos, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {vehiculos.map((v) => (
        <div
          key={v.cod_vehiculo}
          onClick={() => onSelect(v)}
          className="p-6 border rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-xl 
                     cursor-pointer transform hover:-translate-y-1 transition duration-200"
        >
          <h2 className="text-lg font-bold text-indigo-700">{v.descripcion}</h2>
          <p className="text-sm text-gray-600 mt-2">
            📋 {v.contenido}
          </p>
          <p className="text-sm text-gray-600">⏰ {v.horario}</p>
        </div>
      ))}
    </div>
  );
};
