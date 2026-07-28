export interface OcrProviderConfig {
  id: string;
  provider: 'openrouter' | 'google' | 'custom';
  endpoint: string;
  apiKey: string;
  model: string;
  enabled: boolean;
}

export interface OcrResult {
  rawText: string;
  processingMs: number;
}

export interface OcrProviderResponse {
  rawText: string;
  processingMs?: number;
}

export interface OcrError {
  kind: 'network' | 'timeout' | 'unknown_wrapper' | 'encode' | 'provider';
  message: string;
}
