import { OcrError, OcrProviderConfig, OcrProviderResponse, OcrResult } from './types';

const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1_000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class OcrService {
  private controller: AbortController | null = null;

  async execute(
    config: OcrProviderConfig,
    imageBase64: string,
    signal?: AbortSignal
  ): Promise<OcrResult> {
    this.cancel();
    this.controller = new AbortController();
    const combinedSignal = this.createCombinedSignal(signal);

    const startTime = Date.now();
    let lastError: OcrError | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (combinedSignal.aborted) {
        throw makeError('timeout', 'Petición cancelada antes de ejecutar');
      }
      try {
        const raw = await post(
          config.endpoint,
          config.apiKey,
          buildRequestBody(config, imageBase64),
          { timeoutMs: DEFAULT_TIMEOUT_MS, signal: combinedSignal }
        );
        const providerResponse = normalizeResponse(raw);
        return toResult(providerResponse, startTime);
      } catch (err) {
        lastError = err as OcrError;
        if (lastError.kind === 'timeout' || lastError.kind === 'network') {
          if (attempt < MAX_RETRIES) {
            await delay(RETRY_DELAY_MS * (attempt + 1));
            continue;
          }
        }
        throw lastError;
      }
    }
    throw lastError ?? makeError('provider', 'Error desconocido');
  }

  cancel(): void {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }

  private createCombinedSignal(external?: AbortSignal): AbortSignal {
    if (!this.controller) {
      throw new Error('controller not initialized');
    }

    if (external?.aborted) {
      this.controller.abort();
    } else if (external) {
      const cleanup = () => {
        this.controller?.abort();
      };
      external.addEventListener('abort', cleanup, { once: true });
    }

    return this.controller.signal;
  }
}

async function post(
  url: string,
  apiKey: string,
  body: unknown,
  opts: { timeoutMs: number; signal: AbortSignal }
): Promise<unknown> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), opts.timeoutMs);
  opts.signal.addEventListener('abort', () => controller.abort(), { once: true });

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      throw makeError('provider', `HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (isAbortError(err)) throw makeError('timeout', 'La petición excedió el tiempo de espera');
    throw makeError('network', `Error de red: ${err instanceof Error ? err.message : String(err)}`);
  }
}

function buildRequestBody(config: OcrProviderConfig, imageBase64: string): Record<string, unknown> {
  return { model: config.model, image_base64: imageBase64, max_tokens: 512 };
}

function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError';
}

function normalizeResponse(raw: unknown): OcrProviderResponse {
  if (raw === null || raw === undefined || typeof raw !== 'object') {
    throw makeError('unknown_wrapper', 'Respuesta no válida');
  }

  const obj = raw as Record<string, unknown>;

  if (typeof obj.rawText === 'string') {
    return {
      rawText: obj.rawText,
      processingMs: typeof obj.processingMs === 'number' ? obj.processingMs : undefined,
    };
  }

  const choices = Array.isArray(obj.choices)
    ? (obj.choices as Array<{ message?: { content?: unknown } }>)
    : undefined;
  if (choices && choices.length > 0 && typeof choices[0]?.message?.content === 'string') {
    return { rawText: choices[0].message.content as string };
  }

  const candidates = Array.isArray(obj.candidates)
    ? (obj.candidates as Array<{ content?: { parts?: Array<{ text?: unknown }> } }>)
    : undefined;
  if (candidates && candidates.length > 0) {
    const parts = candidates[0]?.content?.parts;
    if (Array.isArray(parts)) {
      const text = parts
        .map((part) => (typeof part === 'object' && part ? (part as Record<string, unknown>).text : undefined))
        .filter((value): value is string => typeof value === 'string')
        .join('');
      if (text.length > 0) return { rawText: text };
    }
  }

  throw makeError('unknown_wrapper', 'No se pudo extraer rawText de la respuesta del proveedor');
}

function toResult(pr: OcrProviderResponse, startTime: number): OcrResult {
  return {
    rawText: pr.rawText,
    processingMs: pr.processingMs ?? Date.now() - startTime,
  };
}

function makeError(kind: OcrError['kind'], message: string): OcrError {
  return { kind, message };
}
