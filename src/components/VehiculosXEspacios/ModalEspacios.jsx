// src/components/Modal.jsx
export default function ModalEspacios({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        {/* Botón cerrar */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Título */}
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}

        {/* Contenido dinámico */}
        <div className="max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
