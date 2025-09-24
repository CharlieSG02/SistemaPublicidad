import React, { useState } from "react";

export default function EditModal({ item, onClose, onSave }) {
  const [form, setForm] = useState(item);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Editar Producto</h2>

        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border p-2 mb-2"
        />
        <input
          name="rubro"
          value={form.rubro}
          onChange={handleChange}
          className="w-full border p-2 mb-2"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
