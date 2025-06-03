import exampleSchema from "@/models/example.models";
import Example from "@/class/example.class";

export class ExampleDto {
  constructor(example) {
    const parsed = exampleSchema.parse(example);
    this.example = new Example(
      parsed.nombre_completo,
      parsed.telefono,
      parsed.email,
      parsed.rut,
      parsed.comentario,
      parsed.utm_source,
      parsed.utm_medium,
      parsed.utm_campaign,
      parsed.created_at,
      parsed.modelo
    );
  }
}
