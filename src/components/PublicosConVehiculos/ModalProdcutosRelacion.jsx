// components/PublicosConTiposProducto/ModalTiposProductoRelacion.jsx
import ModalRelaciones from "../common/ModalRelaciones";
import { publicoTiposProductoAPI } from "../../lib/crudPublicoProductoAPI"; // ← Importación corregida

const configTiposProducto = {
  idKey: "cod_publico_objetivo",
  idKeyRelacionada: "cod_tipo_producto",
  
  nombreEntidadPrincipal: "Público seleccionado",
  nombreEntidadRelacionada: "Tipos de Producto",
  
  titulo: (publico) => `Gestionar tipos de producto - Público: ${publico?.interes}`,
  
  renderEntidadPrincipal: (publico) => (
    <>
      <p><strong>Interés:</strong> {publico?.interes}</p>
      <p><strong>Edad:</strong> {publico?.rango_edad}</p>
      <p><strong>Sexo:</strong> {publico?.sexo}</p>
      <p><strong>NSE:</strong> {publico?.nivel_socioeconomico}</p>
      <p><strong>Educación:</strong> {publico?.nivel_educativo}</p>
    </>
  ),
  
  renderItemRelacionada: (tipoProducto) => (
    <div className="p-3 border rounded-lg bg-white shadow-sm">
      <p className="font-semibold text-gray-900">{tipoProducto.rubro}</p>
      <p className="text-sm text-gray-600 mt-1">
        <span className="font-medium">Familia:</span> {tipoProducto.familia}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-medium">Clase:</span> {tipoProducto.clase}
      </p>
    </div>
  ),
  
  renderItemDisponible: (tipoProducto) => (
    <div className="p-3 border rounded-lg bg-gray-50">
      <p className="font-semibold text-gray-900">{tipoProducto.rubro}</p>
      <p className="text-sm text-gray-600 mt-1">
        <span className="font-medium">Familia:</span> {tipoProducto.familia}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-medium">Clase:</span> {tipoProducto.clase}
      </p>
    </div>
  ),
  
  textoBotonAgregar: (count) => `Agregar seleccionados (${count})`,
  textoBotonRemover: (count) => `Quitar seleccionados (${count})`,
};

export default function ModalTiposProductoRelacion({ publico, isOpen, onClose }) {
  return (
    <ModalRelaciones
      entidadPrincipal={publico}
      entidadRelacionada="tipo_producto"
      isOpen={isOpen}
      onClose={onClose}
      apiGetRelacionados={publicoTiposProductoAPI.getTiposProductoByPublico}
      apiGetDisponibles={publicoTiposProductoAPI.getTiposProductoDisponibles}
      apiBulkAdd={publicoTiposProductoAPI.bulkAdd}
      apiBulkRemove={publicoTiposProductoAPI.bulkRemove}
      config={configTiposProducto}
    />
  );
}