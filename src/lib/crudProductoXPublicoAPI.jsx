import { supabase } from './supabase.config.jsx';
// SE EMPLEÓ LOS RPCs DE MANERA CORRECTA, CON NOMBRE EN ESPAÑOL

export const productoXPublicoAPI = {

  // Publicos relacionados
  async getPublicosByProducto(codProducto) {
    const { data, error } = await supabase
      .from("tipo_producto_publico_objetivo")
      .select("publico_objetivo (cod_publico_objetivo, sexo, nivel_socioeconomico, nivel_educativo, rango_edad, interes,estado_civil)")
      .eq("cod_tipo_producto", codProducto);

    if (error) throw error;
    return data.map((row) => row.publico_objetivo);
  },

  // Públicos objetivos disponibles (via RPC)
  async getPublicosObjetivoDisponibles(codTipoProducto, filters = {}) {
    const {
      busqueda,
      sexo,
      nivelSocioeconomico,
      nivelEducativo,
      rangoEdad,
      interes,
      estadoCivil
    } = filters;

    const { data, error } = await supabase.rpc("publico_objetivo_disponible", {
      p_cod_tipo_producto: codTipoProducto,
      p_busqueda: busqueda,
      p_sexo: sexo,
      p_nivel_socioeconomico: nivelSocioeconomico,
      p_nivel_educativo: nivelEducativo,
      p_rango_edad: rangoEdad,
      p_interes: interes,
      p_estado_civil: estadoCivil
    });

    if (error) throw error;
    return data;
  },

  // Bulk add relaciones tipo producto - público objetivo (RPC)
  async bulkAddTipoProductoPublico(codTipoProducto, codPublicos = []) {
    if (!Array.isArray(codPublicos) || codPublicos.length === 0) return [];

    const { data, error } = await supabase.rpc("Agregar Publicos Objetivos En Grupo a un Tipo de Producto", {
      p_cod_tipo_producto: codTipoProducto,
      p_cod_publicos: codPublicos,
    });

    if (error) throw error;
    return data; // filas insertadas
  },

  // Bulk remove relaciones tipo producto - público objetivo (RPC)
  async bulkRemoveTipoProductoPublico(codTipoProducto, codPublicos = []) {
    if (!Array.isArray(codPublicos) || codPublicos.length === 0) return 0;

    const { data, error } = await supabase.rpc("Remover Publico Objetivo en Grupo para un Tipo de Producto", {
      p_cod_tipo_producto: codTipoProducto,
      p_cod_publicos: codPublicos,
    });

    if (error) throw error;
    return data; // número de filas eliminadas (integer)
  },

  getOnlyWithRelations: async () => {
    const { data, error } = await supabase
      .from('tipo_producto')
      .select(`
        cod_tipo_producto,
        rubro,
        familia,
        clase,
        tipo_producto_publico_objetivo (
          publico_objetivo (
            cod_publico_objetivo,
            sexo,
            nivel_socioeconomico,
            nivel_educativo,
            rango_edad,
            interes,
            estado_civil
          )
        )
      `)
      .order('cod_tipo_producto', { ascending: true });

    if (error) throw error;

    const productosConPublicos = (data || []).map(producto => ({
      id: producto.cod_tipo_producto,
      tipo_producto: {
        cod_tipo_producto: producto.cod_tipo_producto,
        rubro: producto.rubro,
        familia: producto.familia,
        clase: producto.clase
      },
      publicos_objetivo: producto.tipo_producto_publico_objetivo?.map(rel => rel.publico_objetivo) || []
    }));

    // Filtrar solo los que tienen al menos una relación
    return productosConPublicos.filter(p => p.publicos_objetivo.length > 0);
  },
};
