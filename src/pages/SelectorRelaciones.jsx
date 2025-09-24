import { useState } from "react";
import ProductoXPublicoPage from "./TipoProductXPublicObjetivo";
import { PublicoXProductoPage } from "./PublicObjetivoXTipoProduct";
import { Layers, Users } from "lucide-react";

export default function SelectorRelaciones() {
  const [vista, setVista] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-800">
          Selecciona una vista
        </h1>

        {/* Opciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            className={`flex flex-col items-center justify-center gap-3 rounded-2xl p-6 shadow-md border transition-all duration-300 hover:shadow-xl ${vista === "producto"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-blue-100"
              }`}
            onClick={() => setVista("producto")}
          >
            <Layers size={40} />
            <div className="text-lg font-semibold">Producto → Público</div>
            <p className="text-sm opacity-80 text-center">
              Ver cómo cada producto se relaciona con distintos públicos
            </p>
          </button>

          <button
            className={`flex flex-col items-center justify-center gap-3 rounded-2xl p-6 shadow-md border transition-all duration-300 hover:shadow-xl ${vista === "publico"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-green-100"
              }`}
            onClick={() => setVista("publico")}
          >
            <Users size={40} />
            <div className="text-lg font-semibold">Público → Productos</div>
            <p className="text-sm opacity-80 text-center">
              Ver qué productos están asociados a cada público
            </p>
          </button>
        </div>

        {/* Contenido dinámico */}
        <div className="bg-white p-6 rounded-2xl shadow-md border w-full">
          <div className="overflow-x-auto">
            {vista === "producto" && <ProductoXPublicoPage />}
            {vista === "publico" && <PublicoXProductoPage />}
          </div>
          {!vista && (
            <div className="text-center text-gray-500">
              👆 Selecciona una opción para comenzar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
