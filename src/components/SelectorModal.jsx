// components/Publicos/SelectorModal.jsx
import { X, Truck, Package } from 'lucide-react';

export default function SelectorModal({ publico, isOpen, onSelectModal, onClose }) {
  if (!isOpen) return null;

  const options = [
    {
      key: 'vehiculos',
      title: 'Vehículos Publicitarios',
      description: 'Gestiona los vehículos asociados a este público objetivo',
      icon: Truck,
      color: 'from-blue-500 to-blue-600'
    },
    {
      key: 'tipos-producto',
      title: 'Tipos de Producto',
      description: 'Gestiona los tipos de producto asociados a este público objetivo',
      icon: Package,
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4" style={{ top: 0, left: 0, right: 0, bottom: 0, margin: 0, padding: '1rem', width: '100vw', height: '100vh' }} onClick={onClose}>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700/50" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-900">
          <h2 className="text-xl font-bold text-white">
            Gestionar relaciones para: <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">{publico?.interes}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-600/20 rounded-full transition-colors border border-red-500/50 hover:border-red-500"
          >
            <X className="h-5 w-5 text-red-400" />
          </button>
        </div>

        {/* Opciones */}
        <div className="p-6 space-y-4">
          {options.map((option) => (
            <button
              key={option.key}
              onClick={() => onSelectModal(option.key)}
              className="w-full p-5 text-left rounded-xl border border-gray-700/50 bg-gray-700/30 hover:bg-gray-700/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 hover:scale-[1.03] group"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${option.color} shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <option.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg group-hover:text-purple-300 transition-colors">{option.title}</h3>
                  <p className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">{option.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/50 bg-gray-800/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-300 hover:text-white font-medium rounded-lg bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600 hover:border-gray-500 transition-all duration-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}