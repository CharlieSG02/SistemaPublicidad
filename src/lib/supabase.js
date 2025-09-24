import {supabase} from './supabase.config.jsx';

// --- Auth API ---
export const authAPI = {
  signUp: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },
  signIn: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },
  onAuthStateChange: (callback) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return subscription;
  }
};


// Funciones para Tipo de Producto
export const tipoProductoAPI = {
  // Obtener todos los tipos de producto
  getAll: async () => {
    const { data, error } = await supabase
      .from('tipo_producto')
      .select('*')
      .order('cod_tipo_producto', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Crear nuevo tipo de producto
  create: async (tipoProducto) => {
    const { data, error } = await supabase
      .from('tipo_producto')
      .insert([tipoProducto])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Actualizar tipo de producto
  update: async (id, tipoProducto) => {
    const { data, error } = await supabase
    .from('tipo_producto')
    .update(tipoProducto)
    .eq('cod_tipo_producto', id)
    .select('*');

    if (error) throw error;
    return data[0];
  },


  // Eliminar tipo de producto
  delete: async (id) => {
    const { error } = await supabase
      .from('tipo_producto')
      .delete()
      .eq('cod_tipo_producto', id);

    if (error) throw error;
  }
};

// Funciones para Público Objetivo
export const publicoObjetivoAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('publico_objetivo')
      .select('*')
      .order('cod_publico_objetivo', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  create: async (publicoObjetivo) => {
    const { data, error } = await supabase
      .from('publico_objetivo')
      .insert([publicoObjetivo])
      .select();

    if (error) throw error;
    return data[0];
  },

  update: async (id, publicoObjetivo) => {
    const { data, error } = await supabase
      .from('publico_objetivo')
      .update(publicoObjetivo)
      .eq('cod_publico_objetivo', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('publico_objetivo')
      .delete()
      .eq('cod_publico_objetivo', id);

    if (error) throw error;
  }
};

// Funciones para Vehículos Publicitarios
export const vehiculosPublicitariosAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('vehiculos_publicitarios')
      .select('*')
      .order('cod_vehiculo', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  create: async (vehiculo) => {
    const { data, error } = await supabase
      .from('vehiculos_publicitarios')
      .insert([vehiculo])
      .select();

    if (error) throw error;
    return data[0];
  },

  update: async (id, vehiculo) => {
    const { data, error } = await supabase
      .from('vehiculos_publicitarios')
      .update(vehiculo)
      .eq('cod_vehiculo', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('vehiculos_publicitarios')
      .delete()
      .eq('cod_vehiculo', id);

    if (error) throw error;
  }
};

// Funciones para Espacios Publicitarios
export const espaciosPublicitariosAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('espacios_publicitarios')
      .select(`
        *,
        vehiculos_publicitarios (
          descripcion,
          contenido
        )
      `)
      .order('cod_espacio', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  create: async (espacio) => {
    const { data, error } = await supabase
      .from('espacios_publicitarios')
      .insert([espacio])
      .select();

    if (error) throw error;
    return data[0];
  },

  update: async (id, espacio) => {
    const { data, error } = await supabase
      .from('espacios_publicitarios')
      .update(espacio)
      .eq('cod_espacio', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('espacios_publicitarios')
      .delete()
      .eq('cod_espacio', id);

    if (error) throw error;
  }
};

// Función para obtener estadísticas del dashboard
export const dashboardAPI = {
  getStats: async () => {
    try {
      const [
        { count: tipoProductoCount },
        { count: publicoObjetivoCount },
        { count: vehiculosCount },
        { count: espaciosCount },
        { count: relacionesCount } // AÑADIR esta línea
      ] = await Promise.all([
        supabase.from('tipo_producto').select('*', { count: 'exact', head: true }),
        supabase.from('publico_objetivo').select('*', { count: 'exact', head: true }),
        supabase.from('vehiculos_publicitarios').select('*', { count: 'exact', head: true }),
        supabase.from('espacios_publicitarios').select('*', { count: 'exact', head: true }),
        supabase.from('tipo_producto_publico_objetivo').select('*', { count: 'exact', head: true }) // AÑADIR esta línea
      ]);

      return {
        tipoProductoCount: tipoProductoCount || 0,
        publicoObjetivoCount: publicoObjetivoCount || 0,
        vehiculosCount: vehiculosCount || 0,
        espaciosCount: espaciosCount || 0,
        relacionesCount: relacionesCount || 0 // AÑADIR esta línea
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        tipoProductoCount: 0,
        publicoObjetivoCount: 0,
        vehiculosCount: 0,
        espaciosCount: 0,
        relacionesCount: 0 // AÑADIR esta línea
      };
    }
  }
};

// TAMBIÉN AÑADIR: Función para obtener listas para formularios
export const formsAPI = {
  // Obtener lista de productos para select/dropdown
  getTiposProducto: async () => {
    const { data, error } = await supabase
      .from('tipo_producto')
      .select('cod_tipo_producto, rubro, familia, clase')
      .order('rubro', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Obtener lista de públicos para select/dropdown
  getPublicosObjetivo: async () => {
    const { data, error } = await supabase
      .from('publico_objetivo')
      .select('cod_publico_objetivo, sexo, rango_edad, interes, nivel_socioeconomico, estado_civil')
      .order('interes', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Obtener estadísticas para dashboard
  getRelacionesStats: async () => {
    try {
      const [
        { count: totalRelaciones },
        productos,
        publicos
      ] = await Promise.all([
        supabase.from('tipo_producto_publico_objetivo').select('*', { count: 'exact', head: true }),
        supabase.from('tipo_producto').select('rubro').order('rubro'),
        supabase.from('publico_objetivo').select('interes').order('interes')
      ]);

      // Contar productos únicos por rubro
      const productosPorRubro = productos.data?.reduce((acc, prod) => {
        acc[prod.rubro] = (acc[prod.rubro] || 0) + 1;
        return acc;
      }, {}) || {};

      // Contar públicos únicos por interés
      const publicosPorInteres = publicos.data?.reduce((acc, pub) => {
        acc[pub.interes] = (acc[pub.interes] || 0) + 1;
        return acc;
      }, {}) || {};

      return {
        totalRelaciones: totalRelaciones || 0,
        productosPorRubro,
        publicosPorInteres
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        totalRelaciones: 0,
        productosPorRubro: {},
        publicosPorInteres: {}
      };
    }
  }

}



