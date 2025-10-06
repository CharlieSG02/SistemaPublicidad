import { supabase } from './supabase.config.jsx';

/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE PUBLICIDAD - APIs de Supabase
 * ============================================================================
 * 
 * Este archivo contiene las APIs principales para interactuar con Supabase.
 * Organizado por categorías funcionales.
 */

// ============================================================================
// 1. AUTENTICACIÓN
// ============================================================================
/**
 * API de Autenticación
 * Maneja registro, inicio de sesión, cierre de sesión y gestión de usuarios
 * Usado en: Login.jsx, Signup.jsx, AuthContext.jsx, Header.jsx
 */
export const authAPI = {
  // Registrar nuevo usuario
  signUp: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },

  // Iniciar sesión
  signIn: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  // Cerrar sesión
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Obtener usuario actual
  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Obtener sesión actual
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Escuchar cambios en el estado de autenticación
  onAuthStateChange: (callback) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return subscription;
  }
};

// ============================================================================
// 2. VEHÍCULOS PUBLICITARIOS
// ============================================================================
/**
 * API de Vehículos Publicitarios
 * CRUD completo para vehículos publicitarios
 * Usado en: VehiculosPublicitarios.jsx
 */
export const vehiculosPublicitariosAPI = {
  // Obtener todos los vehículos
  getAll: async () => {
    const { data, error } = await supabase
      .from('vehiculos_publicitarios')
      .select('*')
      .order('cod_vehiculo', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Crear nuevo vehículo
  create: async (vehiculo) => {
    const { data, error } = await supabase
      .from('vehiculos_publicitarios')
      .insert([vehiculo])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Actualizar vehículo existente
  update: async (id, vehiculo) => {
    const { data, error } = await supabase
      .from('vehiculos_publicitarios')
      .update(vehiculo)
      .eq('cod_vehiculo', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Eliminar vehículo
  delete: async (id) => {
    const { error } = await supabase
      .from('vehiculos_publicitarios')
      .delete()
      .eq('cod_vehiculo', id);

    if (error) throw error;
  }
};

// ============================================================================
// 3. ESPACIOS PUBLICITARIOS
// ============================================================================
/**
 * API de Espacios Publicitarios
 * CRUD completo para espacios publicitarios con relación a vehículos
 * Usado en: VehiculosPublicitarios.jsx (indirectamente)
 */
export const espaciosPublicitariosAPI = {
  // Obtener todos los espacios con información del vehículo
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

  // Crear nuevo espacio
  create: async (espacio) => {
    const { data, error } = await supabase
      .from('espacios_publicitarios')
      .insert([espacio])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Actualizar espacio existente
  update: async (id, espacio) => {
    const { data, error } = await supabase
      .from('espacios_publicitarios')
      .update(espacio)
      .eq('cod_espacio', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Eliminar espacio
  delete: async (id) => {
    const { error } = await supabase
      .from('espacios_publicitarios')
      .delete()
      .eq('cod_espacio', id);

    if (error) throw error;
  }
};

// ============================================================================
// 4. DASHBOARD Y ESTADÍSTICAS
// ============================================================================
/**
 * API de Dashboard
 * Obtiene estadísticas generales del sistema
 * Usado en: Dashboard.jsx
 */
export const dashboardAPI = {
  // Obtener contadores de todas las entidades principales
  getStats: async () => {
    try {
      const [
        { count: tipoProductoCount },
        { count: publicoObjetivoCount },
        { count: vehiculosCount },
        { count: espaciosCount },
        { count: relacionesCount }
      ] = await Promise.all([
        supabase.from('tipo_producto').select('*', { count: 'exact', head: true }),
        supabase.from('publico_objetivo').select('*', { count: 'exact', head: true }),
        supabase.from('vehiculos_publicitarios').select('*', { count: 'exact', head: true }),
        supabase.from('espacios_publicitarios').select('*', { count: 'exact', head: true }),
        supabase.from('tipo_producto_publico_objetivo').select('*', { count: 'exact', head: true })
      ]);

      return {
        tipoProductoCount: tipoProductoCount || 0,
        publicoObjetivoCount: publicoObjetivoCount || 0,
        vehiculosCount: vehiculosCount || 0,
        espaciosCount: espaciosCount || 0,
        relacionesCount: relacionesCount || 0
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        tipoProductoCount: 0,
        publicoObjetivoCount: 0,
        vehiculosCount: 0,
        espaciosCount: 0,
        relacionesCount: 0
      };
    }
  }
};





