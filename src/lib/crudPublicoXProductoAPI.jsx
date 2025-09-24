import {supabase} from './supabase.config.jsx';

export const publicoXProductoAPI = {
  getOnlyWithRelations: async () => {
    const { data, error } = await supabase
      .from('publico_objetivo')
      .select(`
        cod_publico_objetivo,
        sexo,
        nivel_socioeconomico,
        nivel_educativo,
        rango_edad,
        interes,
        estado_civil,
        tipo_producto_publico_objetivo (
          tipo_producto (
            cod_tipo_producto,
            rubro,
            familia,
            clase
          )
        )
      `)
      .order('cod_publico_objetivo', { ascending: true });

    if (error) throw error;

    const publicosConProductos = (data || []).map(publico => ({
      id: publico.cod_publico_objetivo,
      publico_objetivo: {
        cod_publico_objetivo: publico.cod_publico_objetivo,
        sexo: publico.sexo,
        nivel_socioeconomico: publico.nivel_socioeconomico,
        nivel_educativo: publico.nivel_educativo,
        rango_edad: publico.rango_edad,
        interes: publico.interes,
        estado_civil: publico.estado_civil
      },
      tipos_productos: publico.tipo_producto_publico_objetivo?.map(rel => rel.tipo_producto) || []
    }));

    // Filtrar solo los que tienen al menos una relación
    return publicosConProductos.filter(p => p.tipos_productos.length > 0);
  },
};
