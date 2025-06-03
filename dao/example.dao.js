import exampleSchema, { tablename } from "@/models/example.models";
import { ExampleDto } from "@/dto/example.dto";
import { initSupabase } from "@/config/supabase.config";

export default class ExampleDao {
  static async createExample(exampleData) {
    const exampleDto = new ExampleDto(exampleData);
    const parsed = exampleSchema.parse(exampleDto.example);
    const payload = {
      nombre: parsed.nombre,
      email: parsed.email,
      telefono: parsed.telefono,
      mensaje: parsed.mensaje,
      utm_source: parsed.utm_source,
      utm_medium: parsed.utm_medium,
      utm_campaign: parsed.utm_campaign,
      created_at: parsed.created_at,
    };

    const supabase = await initSupabase();
    if (!supabase) throw new Error("Supabase not initialized");

    const { data, error } = await supabase
      .from(tablename)
      .insert(payload)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
