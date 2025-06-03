import { envs } from "./envs.config";

/**
 * Valida un token de ReCaptcha v3 con Google
 * @param {string} token - Token generado por ReCaptcha
 * @param {string} action - Acción que generó el token
 * @param {number} minScore - Puntuación mínima requerida (0.0 - 1.0)
 * @returns {Promise<{success: boolean, score?: number, action?: string, error?: string}>}
 */
export async function validateRecaptcha(token, action, minScore = 0.5) {
  try {
    if (!token) {
      return { success: false, error: "Token de ReCaptcha requerido" };
    }

    if (!envs.RECAPTCHA_SECRET_KEY) {
      console.error("RECAPTCHA_SECRET_KEY no está configurada");
      return { success: false, error: "Configuración de ReCaptcha inválida" };
    }

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: envs.RECAPTCHA_SECRET_KEY,
          response: token,
        }),
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Error al conectar con Google ReCaptcha",
      };
    }

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: `ReCaptcha falló: ${
          data["error-codes"]?.join(", ") || "Error desconocido"
        }`,
      };
    }

    // Verificar la acción si se proporcionó
    if (action && data.action !== action) {
      return {
        success: false,
        error: `Acción inválida. Esperada: ${action}, Recibida: ${data.action}`,
      };
    }

    // Verificar la puntuación
    if (data.score < minScore) {
      return {
        success: false,
        error: `Puntuación muy baja. Mínima: ${minScore}, Actual: ${data.score}`,
        score: data.score,
      };
    }

    return {
      success: true,
      score: data.score,
      action: data.action,
    };
  } catch (error) {
    console.error("Error validando ReCaptcha:", error);
    return {
      success: false,
      error: "Error interno validando ReCaptcha",
    };
  }
}

/**
 * Middleware para validar ReCaptcha en rutas API
 * @param {string} action - Acción esperada
 * @param {number} minScore - Puntuación mínima
 * @returns {Function} Middleware function
 */
export function withRecaptcha(action, minScore = 0.5) {
  return async (request) => {
    try {
      const body = await request.json();
      const { recaptchaToken, ...data } = body;

      const validation = await validateRecaptcha(
        recaptchaToken,
        action,
        minScore
      );

      if (!validation.success) {
        return {
          isValid: false,
          error: validation.error,
          data: null,
        };
      }

      return {
        isValid: true,
        error: null,
        data: data,
        recaptchaScore: validation.score,
      };
    } catch (error) {
      return {
        isValid: false,
        error: "Error procesando datos del formulario",
        data: null,
      };
    }
  };
}
