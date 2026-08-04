export type FieldSource = 'front' | 'back' | 'both';

export interface Contact {
  id: string;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  note?: string;
  logoUri?: string;
  source: FieldSource;
  createdAt: number;
  updatedAt: number;
}

export interface ScanMetadata {
  contactId: string;
  ocrProvider: 'local' | 'external';
  rawTextFront: string;
  rawTextBack?: string;
  processingMs: number;
}

export interface ProviderConfig {
  id: string;
  provider: 'openrouter' | 'google' | 'custom';
  endpoint: string;
  apiKey: string;
  model: string;
  enabled: boolean;
  updatedAt?: number;
}
