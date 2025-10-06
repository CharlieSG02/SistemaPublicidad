import ModalRelaciones from "../common/ModalRelaciones";
import { vehiculosAPI } from "../../lib/crudVehiculosAPI";

// Configuración específica para la relación Vehículo-Público
const configPublicos = {
  // Keys de IDs
  idKey: "cod_vehiculo",
  idKeyRelacionada: "cod_publico_objetivo",
  
  // Nombres para mostrar
  nombreEntidadPrincipal: "Vehículo seleccionado",
  nombreEntidadRelacionada: "Públicos Objetivo",
  
  // Renderizado
  titulo: (vehiculo) => `Gestionar públicos objetivo - Vehículo: ${vehiculo?.descripcion}`,
  
  renderEntidadPrincipal: (vehiculo) => (
    <>
      <p><strong>Descripción:</strong> {vehiculo?.descripcion}</p>
      <p><strong>Contenido:</strong> {vehiculo?.contenido}</p>
      <p><strong>Horario:</strong> {vehiculo?.horario}</p>
      <p><strong>Hora inicio:</strong> {vehiculo?.hora_inicio}</p>
      <p><strong>Hora fin:</strong> {vehiculo?.hora_fin}</p>
    </>
  ),
  
  renderItemRelacionada: (publico) => (
    <div>
      <p className="font-semibold text-purple-700">{publico.interes}</p>
      <p className="text-xs text-gray-600">
        {publico.sexo} • {publico.rango_edad} • NSE: {publico.nivel_socioeconomico}
      </p>
    </div>
  ),
  
  renderItemDisponible: (publico) => (
    <div>
      <p className="font-semibold text-purple-700">{publico.interes}</p>
      <p className="text-xs text-gray-600">
        {publico.sexo} • {publico.rango_edad} • NSE: {publico.nivel_socioeconomico}
      </p>
    </div>
  ),
  
  // Textos de botones
  textoBotonAgregar: (count) => `Agregar seleccionados (${count})`,
  textoBotonRemover: (count) => `Quitar seleccionados (${count})`,
};

export default function ModalPublicosRelacion({ vehiculo, isOpen, onClose }) {
  return (
    <ModalRelaciones
      entidadPrincipal={vehiculo}
      entidadRelacionada="publicos"
      isOpen={isOpen}
      onClose={onClose}
      // APIs específicas
      apiGetRelacionados={vehiculosAPI.getPublicosByVehiculo}
      apiGetDisponibles={vehiculosAPI.getPublicosDisponibles}
      apiBulkAdd={vehiculosAPI.bulkAddPublicos}
      apiBulkRemove={vehiculosAPI.bulkRemovePublicos}
      // Configuración
      config={configPublicos}
    />
  );
}
