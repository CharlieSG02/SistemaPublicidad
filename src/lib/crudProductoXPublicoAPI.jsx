import {supabase} from './supabase.config.jsx';

export const productoXPublicoAPI = {
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
