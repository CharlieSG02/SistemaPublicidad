// lib/crudPublicoTiposProductoAPI.js
import { supabase } from "./supabase.config";

export const publicoTiposProductoAPI = {
  async getTiposProductoByPublico(codPublico) {
    try {
      console.log("🔍 Buscando tipos de producto relacionados para público:", codPublico);
      
      const { data, error } = await supabase
        .from("tipo_producto_publico_objetivo")
        .select("tipo_producto (cod_tipo_producto, rubro, familia, clase)")
        .eq("cod_publico_objetivo", codPublico);

      if (error) throw error;
      
      const tiposProducto = data.map((row) => row.tipo_producto).filter(item => item !== null);
      console.log("✅ Tipos de producto relacionados:", tiposProducto);
      
      return tiposProducto;
    } catch (error) {
      console.error("💥 Error en getTiposProductoByPublico:", error);
      throw error;
    }
  },

  async getTiposProductoDisponibles(codPublico) {
    try {
      console.log("🔍 Buscando tipos disponibles via RPC para público:", codPublico);
      
      const { data, error } = await supabase.rpc("TIPOS DE PRODUCTOS DISPONIBLES", {
        p_cod_publico: codPublico
      });

      if (error) throw error;
      
      console.log("✅ Tipos disponibles encontrados:", data);
      return data || [];
    } catch (error) {
      console.error("💥 Error en getTiposProductoDisponibles:", error);
      throw error;
    }
  },

  async bulkAdd(codPublico, codTiposProducto = []) {
    try {
      if (!Array.isArray(codTiposProducto) || codTiposProducto.length === 0) {
        console.log("ℹ️ No hay tipos de producto para agregar");
        return [];
      }
      
      console.log("➕ Agregando tipos:", codTiposProducto, "al público:", codPublico);
      
      const { data, error } = await supabase.rpc("AGREGAR TIPOS DE PRODUCTO EN GRUPO A UN PUBLICO OBJETIVO", {
        p_cod_publico: codPublico,
        p_cod_tipos_producto: codTiposProducto,
      });
      
      if (error) throw error;
      
      console.log("✅ Bulk add exitoso:", data);
      return data;
    } catch (error) {
      console.error("💥 Error en bulkAdd:", error);
      throw error;
    }
  },

  async bulkRemove(codPublico, codTiposProducto = []) {
    try {
      if (!Array.isArray(codTiposProducto) || codTiposProducto.length === 0) {
        console.log("ℹ️ No hay tipos de producto para eliminar");
        return 0;
      }
      
      console.log("➖ Eliminando tipos:", codTiposProducto, "del público:", codPublico);
      
      const { data, error } = await supabase.rpc("QUITAR TIPOS DE PRODUCTO EN GRUPO PARA UN PUBLICO OBJETIVO", {
        p_cod_publico: codPublico,
        p_cod_tipos_producto: codTiposProducto,
      });
      
      if (error) throw error;
      
      console.log("✅ Bulk remove exitoso, eliminados:", data);
      return data;
    } catch (error) {
      console.error("💥 Error en bulkRemove:", error);
      throw error;
    }
  },
};