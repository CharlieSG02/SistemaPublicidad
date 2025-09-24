import { supabase } from "../lib/supabase.config";

export const espaciosAPI = {
  getByVehiculo: async (cod_vehiculo) => {
    const { data, error } = await supabase
      .from("espacios_publicitarios")
      .select("*")
      .eq("cod_vehiculo", cod_vehiculo)
      .order("cod_espacio", { ascending: true });

    if (error) throw error;
    return data || [];
  },
};
