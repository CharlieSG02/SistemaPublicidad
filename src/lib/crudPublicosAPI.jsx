// lib/crudPublicosAPI.js
import { supabase } from "./supabase.config";

export const publicoAPI = {
  // Obtener todos los públicos objetivos
  getAll: async () => {
    const { data, error } = await supabase
      .from("publico_objetivo")
      .select("*")
      .order("cod_publico_objetivo", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Obtener un público por ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from("publico_objetivo")
      .select("*")
      .eq("cod_publico_objetivo", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Crear un nuevo público
  create: async (nuevoPublico) => {
    const { data, error } = await supabase
      .from("publico_objetivo")
      .insert([nuevoPublico])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Actualizar un público existente
  update: async (id, updateFields) => {
    const { data, error } = await supabase
      .from("publico_objetivo")
      .update(updateFields)
      .eq("cod_publico_objetivo", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Eliminar un público
  delete: async (id) => {
    const { error } = await supabase
      .from("publico_objetivo")
      .delete()
      .eq("cod_publico_objetivo", id);

    if (error) throw error;
    return true;
  },
};
