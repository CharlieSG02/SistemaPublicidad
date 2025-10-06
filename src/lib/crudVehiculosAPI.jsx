import { supabase } from '../lib/supabase.config';

export const vehiculosAPI = {
  // Obtener todos los vehículos
  getAll: async () => {
    const { data, error } = await supabase
      .from('vehiculos_publicitarios')
      .select('*')
      .order('cod_vehiculo', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Obtener públicos objetivo relacionados con un vehículo
  getPublicosByVehiculo: async (codVehiculo) => {
    const { data, error } = await supabase
      .from('publico_objetivo_vehiculos_publicitarios')
      .select('publico_objetivo (cod_publico_objetivo, sexo, nivel_socioeconomico, nivel_educativo, rango_edad, interes, estado_civil)')
      .eq('cod_vehiculo', codVehiculo);

    if (error) throw error;
    return data.map((row) => row.publico_objetivo);
  },

  // Obtener públicos objetivo disponibles (no relacionados) para un vehículo
  getPublicosDisponibles: async (codVehiculo, filters = {}) => {
    const { busqueda, sexo, nivelSocioEconomico, rangoEdad } = filters;
    const { data, error } = await supabase.rpc('PUBLICOS DISPONIBLES PARA VEHICULO', {
      p_cod_vehiculo: codVehiculo,
      p_busqueda: busqueda,
      p_sexo: sexo,
      p_nivel_socio_economico: nivelSocioEconomico,
      p_rango_edad: rangoEdad
    });

    if (error) throw error;
    return data || [];
  },

  // Agregar múltiples públicos objetivo a un vehículo (bulk)
  bulkAddPublicos: async (codVehiculo, codPublicos = []) => {
    if (!Array.isArray(codPublicos) || codPublicos.length === 0) return [];
    
    const { data, error } = await supabase.rpc('AGREGAR PUBLICOS EN GRUPO A UN VEHICULO', {
      p_cod_vehiculo: codVehiculo,
      p_cod_publicos: codPublicos
    });

    if (error) throw error;
    return data; // filas insertadas
  },

  // Eliminar múltiples públicos objetivo de un vehículo (bulk)
  bulkRemovePublicos: async (codVehiculo, codPublicos = []) => {
    if (!Array.isArray(codPublicos) || codPublicos.length === 0) return 0;
    
    const { data, error } = await supabase.rpc('QUITAR PUBLICOS EN GRUPO DE UN VEHICULO', {
      p_cod_vehiculo: codVehiculo,
      p_cod_publicos: codPublicos
    });

    if (error) throw error;
    return data; // número de filas eliminadas
  }
};