// lib/crudPublicoVehiculosAPI.js
import { supabase } from "./supabase.config";

export const publicoVehiculosAPI = {
  // Vehículos relacionados
  async getVehiculosByPublico(codPublico) {
    const { data, error } = await supabase
      .from("publico_objetivo_vehiculos_publicitarios")
      .select("vehiculos_publicitarios (cod_vehiculo, descripcion, contenido, horario, hora_inicio, hora_fin)")
      .eq("cod_publico_objetivo", codPublico);

    if (error) throw error;
    return data.map((row) => row.vehiculos_publicitarios);
  },

  // Vehículos disponibles (via RPC)
  async getVehiculosDisponibles(codPublico, filters = {}) {
    const { busqueda, horaInicio, horaFin } = filters;
    const { data, error } = await supabase.rpc("vehiculos_disponibles", {
      p_cod_publico: codPublico,
      p_busqueda: busqueda,
      p_hora_inicio: horaInicio,
      p_hora_fin: horaFin,
    });

    if (error) throw error;
    return data;
  },

  // nuevo: bulk add (RPC)
  async bulkAdd(codPublico, codVehiculos = []) {
    if (!Array.isArray(codVehiculos) || codVehiculos.length === 0) return [];
    const { data, error } = await supabase.rpc("add_relations_bulk", {
      p_cod_publico: codPublico,
      p_cod_vehiculos: codVehiculos,
    });
    if (error) throw error;
    return data; // filas insertadas
  },

  // nuevo: bulk remove (RPC)
  async bulkRemove(codPublico, codVehiculos = []) {
    if (!Array.isArray(codVehiculos) || codVehiculos.length === 0) return 0;
    const { data, error } = await supabase.rpc("remove_relations_bulk", {
      p_cod_publico: codPublico,
      p_cod_vehiculos: codVehiculos,
    });
    if (error) throw error;
    return data; // number deleted (de la definición devuelve integer)
  },

  // nuevo: suggest by interest
  async suggestByInterest(codPublico, limit = 50) {
    const { data, error } = await supabase.rpc("suggest_vehiculos_by_interest", {
      p_cod_publico: codPublico,
      p_limit: limit,
    });
    if (error) throw error;
    return data;
  },

  async add(codPublico, codVehiculo) {
    const { error } = await supabase
      .from("publico_objetivo_vehiculos_publicitarios")
      .insert([{ cod_publico_objetivo: codPublico, cod_vehiculo: codVehiculo }]);
    if (error) throw error;
  },

  async remove(codPublico, codVehiculo) {
    const { error } = await supabase
      .from("publico_objetivo_vehiculos_publicitarios")
      .delete()
      .eq("cod_publico_objetivo", codPublico)
      .eq("cod_vehiculo", codVehiculo);
    if (error) throw error;
  },
};
