import {
  validateRut,
  formatRut,
  getCheckDigit,
  generateRut,
  generateMulRut,
  sanitiseRut,
} from "chilerut";

export const validador_rut = (rut) => {
  if (!rut) return;

  validateRut(rut);

  if (!validateRut(rut)) {
    return {
      valid: false,
      message: "El rut no es válido",
    };
  }

  return {
    valid: true,
    message: "El rut es válido",
  };
};

export const sanitizar_rut = (rut) => {
  if (!rut) return;

  const rut_sanitizado = sanitiseRut(rut);
  return rut_sanitizado;
};

export const generar_rut_multi = (cantidad) => {
  if (!cantidad) return;

  const genOpts = {
    count: cantidad,
    dots: true,
    hyphen: true,
  };

  const ruts_generados = generateMulRut(genOpts);
  return ruts_generados;
};

export const obtener_digito_verificador = (rut) => {
  if (!rut) return;

  const digito_verificador = getCheckDigit(rut);
  return digito_verificador;
};

export const formatear_rut = (rut) => {
  if (!rut) return;

  const rut_formateado = formatRut(rut);
  return rut_formateado;
};

export const generar_rut = (rut) => {
  const genOpts = {
    dots: true,
    hyphen: true,
  };

  rut = generateRut(genOpts);
  console.log(rut);
  return rut;
};
