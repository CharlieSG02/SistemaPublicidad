// lib/crudPublicoTiposProductoAPI.js
import { supabase } from "./supabase.config";

export const publicoTiposProductoAPI = {
  // Tipos de producto relacionados
  async getTiposProductoByPublico(codPublico) {
    const { data, error } = await supabase
      .from("tipo_producto_publico_objetivo")
      .select("tipo_producto (cod_tipo_producto, rubro, familia, clase)")
      .eq("cod_publico_objetivo", codPublico);

    if (error) throw error;
    return data.map((row) => row.tipo_producto);
  },

  // Tipos de producto disponibles
  async getTiposProductoDisponibles(codPublico) {
    const { data, error } = await supabase.rpc("tipos_producto_disponibles", {
      p_cod_publico: codPublico
    });

    if (error) throw error;
    return data;
  },

  // Bulk operations
  async bulkAdd(codPublico, codTiposProducto = []) {
    if (!Array.isArray(codTiposProducto) || codTiposProducto.length === 0) return [];
    const { data, error } = await supabase.rpc("add_tipos_producto_bulk", {
      p_cod_publico: codPublico,
      p_cod_tipos_producto: codTiposProducto,
    });
    if (error) throw error;
    return data;
  },

  async bulkRemove(codPublico, codTiposProducto = []) {
    if (!Array.isArray(codTiposProducto) || codTiposProducto.length === 0) return 0;
    const { data, error } = await supabase.rpc("remove_tipos_producto_bulk", {
      p_cod_publico: codPublico,
      p_cod_tipos_producto: codTiposProducto,
    });
    if (error) throw error;
    return data;
  },
};