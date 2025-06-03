import { z } from "zod";

const exampleSchema = z.object({
  nombre: z.string().min(1),
  email: z.string().email(),
  telefono: z.string().min(1),
  mensaje: z.string().min(1),
  utm_source: z.string().nullish().default(""),
  utm_medium: z.string().nullish().default(""),
  utm_campaign: z.string().nullish().default(""),
  created_at: z.string().min(1),
});

export default exampleSchema;
export const tablename = "example";
