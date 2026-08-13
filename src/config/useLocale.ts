import { useState, useEffect } from 'react';
import { SupportedLocale, translations, TranslationKey, STORAGE_KEY_LOCALE } from '../config/i18n';
import storage from '../lib/mmkv';

export type { SupportedLocale, TranslationKey };

export function useLocale() {
  const [locale, setLocale] = useState<SupportedLocale>('es');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await storage.getString(STORAGE_KEY_LOCALE);
      if (stored === 'en' || stored === 'es') {
        setLocale(stored);
      }
      setReady(true);
    })();
  }, []);

  const changeLocale = async (next: SupportedLocale) => {
    setLocale(next);
    await storage.setString(STORAGE_KEY_LOCALE, next);
  };

  const t = (key: TranslationKey, ...params: unknown[]) => {
    const value = translations[locale][key];
    if (typeof value === 'function') {
      return (value as (...args: unknown[]) => string)(params);
    }
    return value as string;
  };

  return { locale, changeLocale, t, ready };
}
