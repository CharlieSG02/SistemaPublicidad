import {supabase} from '../lib/supabase.config'

export const vehiculosAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('vehiculos_publicitarios')
      .select('*')
      .order('cod_vehiculo', { ascending: true });

    if (error) throw error;
    return data || [];
  },
}