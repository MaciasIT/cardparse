/**
 * CardParse — Almacenamiento local con AsyncStorage.
 *
 * Capa de abstracción sobre @react-native-async-storage/async-storage
 * para mantener compatibilidad con el resto del código.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  getString: async (key: string): Promise<string | null> => {
    return AsyncStorage.getItem(key);
  },
  setString: async (key: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(key, value);
  },
  getBoolean: async (key: string): Promise<boolean | null> => {
    const val = await AsyncStorage.getItem(key);
    return val === 'true' ? true : val === 'false' ? false : null;
  },
  setBoolean: async (key: string, value: boolean): Promise<void> => {
    await AsyncStorage.setItem(key, String(value));
  },
  getObject: async <T>(key: string): Promise<T | null> => {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setObject: async (key: string, value: unknown): Promise<void> => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  remove: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },
};

export default storage;
