/**
 * CardParse — Combina los textos OCR de ambas caras de una tarjeta.
 *
 * Orden: cara A primero, cara B después. Normaliza espacios múltiples
 * y elimina líneas vacías redundantes sin perder contenido.
 */
export function combineSides(frontText: string | null | undefined, backText: string | null | undefined): string {
  const parts = [frontText, backText]
    .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
    .map((t) => t.replace(/\s+/g, ' ').trim());

  if (parts.length === 0) return '';
  return parts.join('\n');
}
