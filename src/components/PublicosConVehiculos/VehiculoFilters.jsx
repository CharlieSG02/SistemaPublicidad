// components/Publicos/VehiculoFilters.jsx
import { useState, useEffect } from "react";

export default function VehiculoFilters({ onFilterChange }) {
  const [busqueda, setBusqueda] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");


  const handleChange = () => {
    onFilterChange({
      busqueda: busqueda || null,
      horaInicio: horaInicio || null,
      horaFin: horaFin || null,
    });
  };

  return (
    <div className="space-y-2 bg-gray-50 p-4 rounded-lg border">
      {/* Búsqueda general */}
      <input
        type="text"
        placeholder="Buscar por descripción, contenido u horario..."
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value);
          handleChange();
        }}
        className="w-full border rounded px-3 py-2"
      />

      {/* Filtro de rango de horas */}
      <div className="flex gap-2">
        <input
          type="time"
          value={horaInicio}
          onChange={(e) => {
            setHoraInicio(e.target.value);
            handleChange();
          }}
          className="flex-1 border rounded px-3 py-2"
        />
        <input
          type="time"
          value={horaFin}
          onChange={(e) => {
            setHoraFin(e.target.value);
            handleChange();
          }}
          className="flex-1 border rounded px-3 py-2"
        />
      </div>
    </div>
  );
}
