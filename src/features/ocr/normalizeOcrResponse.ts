import { OcrError, OcrProviderResponse, OcrResult } from './types';

/**
 * Extrae `rawText` (y opcionalmente `processingMs`) de la respuesta
 * de un proveedor OCR, normalizando wrappers conocidos.
 *
 * Wrappers soportados:
 * - Directo:                 { rawText: string }
 * - OpenAI-compatible:       { choices: [{ message: { content } }] }
 * - OpenRouter anidado:      { data: { choices: [{ message: { content } }] } }
 * - Google Gemini:           { candidates: [{ content: { parts: [{ text }] } }] }
 *
 * Lanza OcrError con kind='unknown_wrapper' si no reconoce la estructura.
 */
export function normalizeOcrResponse(raw: unknown): OcrProviderResponse {
  if (raw === null || raw === undefined || typeof raw !== 'object') {
    throw makeError('unknown_wrapper', 'La respuesta del proveedor no es un objeto válido');
  }

  const data = raw as Record<string, unknown>;

  if (typeof data.rawText === 'string') {
    return {
      rawText: data.rawText,
      processingMs: typeof data.processingMs === 'number' ? data.processingMs : undefined,
    };
  }

  const choices = extractChoices(data);
  if (choices) {
    const text = choices[0]?.message?.content;
    if (typeof text === 'string') {
      return { rawText: text };
    }
  }

  const textFromCandidates = extractGeminiText(data);
  if (textFromCandidates) {
    return { rawText: textFromCandidates };
  }

  throw makeError('unknown_wrapper', 'No se pudo extraer rawText de la respuesta del proveedor');
}

function extractChoices(data: Record<string, unknown>): Array<{ message?: { content?: unknown } }> | undefined {
  const direct = data.choices;
  if (Array.isArray(direct)) {
    return direct as Array<{ message?: { content?: unknown } }>;
  }

  const nested = data.data;
  if (nested && typeof nested === 'object') {
    const nestedChoices = (nested as Record<string, unknown>).choices;
    if (Array.isArray(nestedChoices)) {
      return nestedChoices as Array<{ message?: { content?: unknown } }>;
    }
  }

  return undefined;
}

function extractGeminiText(data: Record<string, unknown>): string | undefined {
  const candidates = data.candidates;
  if (!Array.isArray(candidates)) {
    return undefined;
  }

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'object') continue;
    const content = (candidate as Record<string, unknown>).content;
    if (!content || typeof content !== 'object') continue;

    const parts = (content as Record<string, unknown>).parts;
    if (!Array.isArray(parts)) continue;

    const text = parts
      .map((part) => (typeof part === 'object' && part ? (part as Record<string, unknown>).text : undefined))
      .filter((value): value is string => typeof value === 'string')
      .join('');

    if (text.length > 0) {
      return text;
    }
  }

  return undefined;
}

function makeError(kind: OcrError['kind'], message: string): OcrError {
  return { kind, message };
}

/**
 * Convierte la respuesta de un proveedor OCR en un OcrResult con
 * el texto extraído y el tiempo medido de procesamiento.
 */
export function toOcrResult(providerResponse: OcrProviderResponse, startTime: number): OcrResult {
  return {
    rawText: providerResponse.rawText,
    processingMs: providerResponse.processingMs ?? Date.now() - startTime,
  };
}
