# Diseño T20 — Onboarding completo

## Variables
- **FUENTE ÚNICA** de provisión: `app/layout.tsx`, `src/screens/OnboardingScreen.tsx`, `src/screens/SettingsScreen.tsx`, `src/lib/storage.ts`, `src/lib/mmkv.ts`.
- No se inventa navegación ni almacenamiento nuevo sin dato.

## Componentes modificados
- `src/screens/OnboardingScreen.tsx`: 3 pasos + clave desde `STORAGE_KEYS`.
- `app/layout.tsx`: monta onboarding como overlay con estado local.
- `src/screens/SettingsScreen.tsx`: prop `onRestartOnboarding?` y fila funcional.
- `src/lib/storage.ts`: añade `onboarding: '@cardparse/onboarding/done'` a `STORAGE_KEYS`.

## OnboardingScreen
- Estado `step: 0|1|2`. `handleNext`: paso <2 → siguiente; paso 2 → `storage.setBoolean(KEY, true)` + `onFinish()`.
- Pasos:
  1. Intro: "CardParse — escanea tarjetas de visita y extrae nombre, email y teléfono".
  2. Guardar/compartir: "Revisa, edita y comparte vCards con un toque".
  3. Doble cara (nuevo): "Gira la tarjeta y escanea también el reverso: la app une ambas caras en un solo contacto".
- Usa `storage` (capa AsyncStorage de `src/lib/mmkv.ts`) con `STORAGE_KEYS.onboarding`.

## layout.tsx
- Estado `onboardingDone: boolean | null` (null = comprobando).
- `useEffect` al montar: `storage.getBoolean(STORAGE_KEYS.onboarding)` → set.
- Render:
  - `onboardingDone === null` → pantalla de carga mínima.
  - `onboardingDone === false` → `<OnboardingScreen onFinish={...} />` envuelto en overlay que cubre la navegación (las tabs siguen montadas debajo pero no accesibles).
  - `true` → tabs normales.
- `onFinish`: `setOnboardingDone(true)`.

## SettingsScreen
- Nueva prop `onRestartOnboarding?: () => void`.
- La fila "Onboarding" pasa de estática a: si hay callback, `onPress` que llama al callback y muestra feedback; sin callback, la fila queda como está hoy (texto "Reiniciar" sin acción) — nunca rompe.

## Reinicio (en layout o contenedor)
- `handleRestartOnboarding`: borra la clave (`storage.remove(STORAGE_KEYS.onboarding)`) + `setOnboardingDone(false)` → el onboarding vuelve a montarse.
- Se pasa como `onRestartOnboarding` a `SettingsScreen` desde el layout (las screens reciben props del layout que las monta).

## Límites
- Sin dependencias nuevas.
- Sin cambios en ScannerScreen, HistoryScreen ni navegación de tabs.
- Sin rediseño visual; solo texto y estructura de pasos.
