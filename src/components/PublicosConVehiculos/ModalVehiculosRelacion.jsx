import ModalRelaciones from "../../components/common/ModalRelaciones";
import { publicoVehiculosAPI } from "../../lib/crudPublicoVehiculosAPI";

// Configuración específica para la relación Público-Vehículo
const configVehiculos = {
  // Keys de IDs
  idKey: "cod_publico_objetivo",
  idKeyRelacionada: "cod_vehiculo",
  
  // Nombres para mostrar
  nombreEntidadPrincipal: "Público seleccionado",
  nombreEntidadRelacionada: "Vehículos",
  
  // Renderizado
  titulo: (publico) => `Gestionar vehículos - Público: ${publico?.interes}`,
  
  renderEntidadPrincipal: (publico) => (
    <>
      <p><strong>Interés:</strong> {publico?.interes}</p>
      <p><strong>Edad:</strong> {publico?.rango_edad}</p>
      <p><strong>Sexo:</strong> {publico?.sexo}</p>
      <p><strong>NSE:</strong> {publico?.nivel_socioeconomico}</p>
      <p><strong>Educación:</strong> {publico?.nivel_educativo}</p>
    </>
  ),
  
  renderItemRelacionada: (vehiculo) => (
    <div>
      <p className="font-semibold">{vehiculo.descripcion}</p>
      <p className="text-xs text-gray-500">
        {vehiculo.contenido} • {vehiculo.horario}
      </p>
    </div>
  ),
  
  renderItemDisponible: (vehiculo) => (
    <div>
      <p className="font-semibold">{vehiculo.descripcion}</p>
      <p className="text-xs text-gray-500">
        {vehiculo.contenido} • {vehiculo.horario}
      </p>
    </div>
  ),
  
  // Textos de botones
  textoBotonAgregar: (count) => `Agregar seleccionados (${count})`,
  textoBotonRemover: (count) => `Quitar seleccionados (${count})`,
  
  // Componente de filtros
};

export default function ModalVehiculosRelacion({ publico, isOpen, onClose }) {
  return (
    <ModalRelaciones
      entidadPrincipal={publico}
      entidadRelacionada="vehiculos"
      isOpen={isOpen}
      onClose={onClose}
      // APIs específicas
      apiGetRelacionados={publicoVehiculosAPI.getVehiculosByPublico}
      apiGetDisponibles={publicoVehiculosAPI.getVehiculosDisponibles}
      apiBulkAdd={publicoVehiculosAPI.bulkAdd}
      apiBulkRemove={publicoVehiculosAPI.bulkRemove}
      // Configuración
      config={configVehiculos}
    />
  );
}