import { createClient } from "@supabase/supabase-js";
import { envs } from "./envs.config";

const supabaseUrl = envs.SUPABASE_URI;
const supabaseAnonKey = envs.SUPABASE_API;

export async function initSupabase() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    return supabase;
  } catch (error) {
    console.error("Error initializing Supabase client:", error);
    throw error;
  }
}
