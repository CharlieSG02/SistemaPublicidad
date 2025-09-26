
import { supabase } from "./supabase.config";

export const productoAPI = {
  // Obtener todos los públicos objetivos
  getAll: async () => {
    const { data, error } = await supabase
      .from("tipo_producto")
      .select("*")
      .order("cod_tipo_producto", { ascending: true });

    if (error) throw error;
    return data || [];
  },

};
