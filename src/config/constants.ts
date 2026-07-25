/**
 * CardParse — Configuración global de constantes.
 *
 * Centralizamos aquí valores "mágicos" para no repetirlos por el código.
 * Cambiar un comportamiento global debería empezar casi siempre por aquí.
 */

/**
 * Límite de contactos en almacenamiento local.
 */
export const MAX_CONTACTS = 5000;

/**
 * Formato de fecha para mostrar en UI.
 */
export const DATE_FORMAT = new Intl.DateTimeFormat('es', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

/**
 * VCard versión emitida por la app.
 */
export const VCARD_VERSION = '3.0';

/**
 * Pesos por defecto de etiquetas telefónicas.
 */
export const PHONE_LABELS = ['móvil', 'trabajo', 'personal', 'fax'] as const;

/**
 * Pesos por defecto de etiquetas de email.
 */
export const EMAIL_LABELS = ['trabajo', 'personal'] as const;

/**
 * Duración del splash de onboarding en ms.
 */
export const ONBOARDING_DELAY = 2500;

/**
 * Número de caras soportadas: 1 o 2.
 */
export const SUPPORTED_FACES = 2 as const;
