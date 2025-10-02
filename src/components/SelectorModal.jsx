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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Gestionar relaciones para: <span className="text-purple-600">{publico?.interes}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Opciones */}
        <div className="p-6 space-y-4">
          {options.map((option) => (
            <button
              key={option.key}
              onClick={() => onSelectModal(option.key)}
              className="w-full p-4 text-left rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${option.color}`}>
                  <option.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{option.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}