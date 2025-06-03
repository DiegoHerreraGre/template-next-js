/**
 * Configuración de acciones de ReCaptcha v3
 * Las acciones deben contener solo caracteres alfanuméricos, barras y guiones bajos
 * No deben ser específicas del usuario
 */
export const RECAPTCHA_ACTIONS = {
  // Formulario de cotización de propiedades
  COTIZAR_PROPIEDAD: "cotizar_propiedad",

  // Formulario de contacto general
  CONTACTO_GENERAL: "contacto_general",

  // Visualización de páginas (para análisis)
  PAGE_VIEW: "page_view",

  // Futuras acciones
  NEWSLETTER_SIGNUP: "newsletter_signup",
  PHONE_CALL_REQUEST: "phone_call_request",
};

/**
 * Puntuaciones mínimas por acción
 * 0.0 - 1.0 donde 1.0 es más humano
 */
export const RECAPTCHA_MIN_SCORES = {
  [RECAPTCHA_ACTIONS.COTIZAR_PROPIEDAD]: 0.5,
  [RECAPTCHA_ACTIONS.CONTACTO_GENERAL]: 0.5,
  [RECAPTCHA_ACTIONS.PAGE_VIEW]: 0.3,
  [RECAPTCHA_ACTIONS.NEWSLETTER_SIGNUP]: 0.6,
  [RECAPTCHA_ACTIONS.PHONE_CALL_REQUEST]: 0.7,
};

/**
 * Configuración por ambiente
 */
export const RECAPTCHA_CONFIG = {
  // En desarrollo, puntuaciones más bajas para facilitar testing
  development: {
    minScore: 0.3,
    logDetails: true,
  },
  // En producción, puntuaciones más estrictas
  production: {
    minScore: 0.5,
    logDetails: false,
  },
};

/**
 * Obtiene la puntuación mínima para una acción específica
 * @param {string} action - Acción de ReCaptcha
 * @param {string} environment - Ambiente (development/production)
 * @returns {number} Puntuación mínima
 */
export function getMinScoreForAction(action, environment = "production") {
  const envConfig =
    RECAPTCHA_CONFIG[environment] || RECAPTCHA_CONFIG.production;
  const actionScore = RECAPTCHA_MIN_SCORES[action];

  return actionScore !== undefined ? actionScore : envConfig.minScore;
}
