/**
 * CardParse — Almacenamiento local con AsyncStorage.
 *
 * Seguridad:
 * - No se guardan fotos completas aquí, solo URIs a cacheDir.
 * - ProviderConfig incluye apiKey: string, sensible.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact, ProviderConfig } from '../types/contact';
import { MAX_CONTACTS } from '../config/constants';

export const STORAGE_KEYS = {
  contacts: '@cardparse/contacts',
  provider: '@cardparse/provider',
  appConfig: '@cardparse/app-config',
} as const;

export function serializeContacts(contacts: Contact[]): string {
  return JSON.stringify(contacts);
}

export function deserializeContacts(rawValue: string | undefined | null): Contact[] {
  if (!rawValue) return [];
  try {
    const parsed = JSON.parse(rawValue) as Partial<Contact>[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is Contact => {
        if (!item || typeof item.id !== 'string') return false;
        return true;
      })
      .slice(0, MAX_CONTACTS);
  } catch {
    return [];
  }
}

export async function saveContacts(contacts: Contact[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.contacts, serializeContacts(contacts));
}

export async function loadContacts(): Promise<Contact[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.contacts);
  return deserializeContacts(raw);
}

export async function saveProviderConfig(config: ProviderConfig): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.provider, JSON.stringify(config));
}

export async function loadProviderConfig(): Promise<ProviderConfig | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.provider);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ProviderConfig>;
    if (!parsed?.id || !parsed?.endpoint || !parsed?.model) return null;
    return {
      id: parsed.id,
      provider: parsed.provider ?? 'custom',
      endpoint: parsed.endpoint,
      apiKey: parsed.apiKey ?? '',
      model: parsed.model,
      enabled: parsed.enabled ?? true,
    };
  } catch {
    return null;
  }
}
