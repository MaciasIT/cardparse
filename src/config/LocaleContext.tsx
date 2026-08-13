import React, { createContext, useContext } from 'react';
import { useLocale, SupportedLocale, TranslationKey } from './useLocale';

type LocaleContextValue = {
  locale: SupportedLocale;
  changeLocale: (next: SupportedLocale) => Promise<void>;
  t: (key: TranslationKey, ...params: unknown[]) => string;
  ready: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();

  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: 'es',
      changeLocale: async () => {},
      t: (key: TranslationKey) => key,
      ready: true,
    };
  }
  return ctx;
}

export type { SupportedLocale, TranslationKey };
