import ModalRelaciones from "../common/ModalRelaciones";
import {productoXPublicoAPI} from '../../lib/crudProductoXPublicoAPI'

// Configuración específica para la relación Público-Vehículo
const configPublicos = {
  // Keys de IDs
  idKey: "cod_tipo_producto",
  idKeyRelacionada: "cod_publico_objetivo",
  
  // Nombres para mostrar
  nombreEntidadPrincipal: "Tipo de Producto seleccionado",
  nombreEntidadRelacionada: "Publicos",
  
  // Renderizado
  titulo: (producto) => `Gestionar publicos - Tipo de Producto: ${producto?.rubro}`,
  
  renderEntidadPrincipal: (producto) => (
    <>
      <p><strong>Rubro:</strong> {producto?.rubro}</p>
      <p><strong>Familia:</strong> {producto?.familia}</p>
      <p><strong>Clase:</strong> {producto?.clase}</p>
    </>
  ),
  
  renderItemRelacionada: (publico) => (
    <div>
      <p className="font-semibold">{publico?.interes}</p>
      <p className="text-xs text-gray-500">
        {publico?.sexo} • {publico?.nivel_educativo}
      </p>
    </div>
  ),
  
  renderItemDisponible: (publico) => (
    <div>
      <p className="font-semibold">{publico?.interes}</p>
      <p className="text-xs text-gray-500">
        {publico?.sexo} • {publico?.nivel_socioeconomico}• {publico?.nivel_educativo}
      </p>
      <p className="text-xs text-gray-500">
        {publico?.rango_edad} • {publico?.estado_civil}
      </p>
    </div>
  ),
  
  // Textos de botones
  textoBotonAgregar: (count) => `Agregar seleccionados (${count})`,
  textoBotonRemover: (count) => `Quitar seleccionados (${count})`,
  
};

export default function ModalPublicosRelacion({ producto , isOpen, onClose }) {
    return (
        <ModalRelaciones
          entidadPrincipal={producto}
          entidadRelacionada="publicos"
          isOpen={isOpen}
          onClose={onClose}
          // APIs específicas
          apiGetRelacionados={productoXPublicoAPI.getPublicosByProducto}
          apiGetDisponibles={productoXPublicoAPI.getPublicosObjetivoDisponibles}
          apiBulkAdd={productoXPublicoAPI.bulkAddTipoProductoPublico}
          apiBulkRemove={productoXPublicoAPI.bulkRemoveTipoProductoPublico}
          // Configuración
          config={configPublicos}
        />
      );
  }