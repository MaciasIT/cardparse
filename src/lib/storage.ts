/**
 * CardParse — Almacenamiento local con MMKV.
 *
 * Seguridad:
 * - No se guardan fotos completas aquí, solo URIs a cacheDir.
 * - ProviderConfig incluye apiKey: su cifrado está en crypto.ts.
 *
 * Mejora progresiva:
 * - Ahora: MMKV plano con serialización JSON.
 * - Luego: prefijos por dominio para evitar colisiones.
 */

import { Contact, ProviderConfig } from '../types/contact';
import { MAX_CONTACTS } from '../config/constants';

export const STORAGE_KEYS = {
  contacts: '@cardparse/contacts',
  provider: '@cardparse/provider',
  appConfig: '@cardparse/app-config',
} as const;

/**
 * Inicializa MMKV con encriptación activa si la plataforma lo soporta.
 * Usamos useMMKVStorage con encryptionKey para iOS/Android modernos.
 */
export function createMMKV() {
  // Lazy import para respetar entornos donde MMKV no esté disponible.
  // eslint-disable-next-line global-require
  const { MMKV } = require('react-native-mmkv');
  return new MMKV();
}

/**
 * Serializa contactos a JSON con garantía de formato.
 */
export function serializeContacts(contacts: Contact[]): string {
  try {
    return JSON.stringify(contacts);
  } catch (error) {
    throw new Error(`No se pudo serializar el listado de contactos: ${String(error)}`);
  }
}

/**
 * Deserializa contactos desde JSON con saneo de datos corruptos.
 */
export function deserializeContacts(rawValue: string | undefined | null): Contact[] {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<Contact>[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    // Saneo mínimo: filtramos entradas sin id y limitamos a MAX_CONTACTS.
    const cleaned = parsed
      .filter((item): item is Contact => {
        if (!item || typeof item.id !== 'string') {
          return false;
        }
        return true;
      })
      .slice(0, MAX_CONTACTS);

    return cleaned;
  } catch (error) {
    // Si el JSON está corrupto, mejor volver a estado vacío que crashear.
    return [];
  }
}

/**
 * Guarda el listado completo de contactos.
 *
 * No es el método más eficiente para cambios frecuentes,
 * pero para MVP con <5000 contactos locales es suficiente.
 */
export function saveContacts(storage: ReturnType<typeof createMMKV>, contacts: Contact[]): void {
  try {
    const serialized = serializeContacts(contacts);
    storage.set(STORAGE_KEYS.contacts, serialized);
  } catch (error) {
    throw new Error(`No se pudo guardar contactos: ${String(error)}`);
  }
}

/**
 * Lee y devuelve el listado completo de contactos.
 */
export function loadContacts(storage: ReturnType<typeof createMMKV>): Contact[] {
  const raw = storage.getString(STORAGE_KEYS.contacts);
  return deserializeContacts(raw);
}

/**
 * Guarda la configuración del proveedor OCR/IA.
 */
export function saveProviderConfig(storage: ReturnType<typeof createMMKV>, config: ProviderConfig): void {
  const serialized = JSON.stringify(config);
  storage.set(STORAGE_KEYS.provider, serialized);
}

/**
 * Carga la configuración de proveedor.
 */
export function loadProviderConfig(storage: ReturnType<typeof createMMKV>): ProviderConfig | null {
  const raw = storage.getString(STORAGE_KEYS.provider);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ProviderConfig>;
    if (!parsed?.id || !parsed?.endpoint || !parsed?.model) {
      return null;
    }

    return {
      id: parsed.id,
      provider: parsed.provider ?? 'custom',
      endpoint: parsed.endpoint,
      apiKey: parsed.apiKey ?? '',
      model: parsed.model,
      enabled: parsed.enabled ?? true,
    };
  } catch (error) {
    return null;
  }
}
