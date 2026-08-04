# T20 — Onboarding completo (3 pantallas + montaje + reinicio)

## Why
El onboarding existe (2 pasos) pero **no está conectado a la app**: `layout.tsx` no lo monta, así que ningún usuario lo ve nunca. Además la fila "Onboarding → Reiniciar" de Ajustes es estática (sin acción). Con T17 (doble cara) ya hay una capacidad que el usuario debe conocer antes de escanear. Esta tarea completa HU-13: onboarding de 3 pasos visible en el arranque y reiniciable desde Ajustes.

## What Changes
- `OnboardingScreen` pasa de 2 a **3 pasos**: (1) intro CardParse, (2) guardar y compartir, (3) tutorial de doble cara (nuevo, alineado con T17).
- `app/layout.tsx` **monta el onboarding**: al arrancar, lee la clave `@cardparse/onboarding/done`; si no está, muestra el onboarding como overlay sobre los tabs; al terminar, guarda la clave y revela la app.
- `SettingsScreen` recibe prop opcional `onRestartOnboarding`: la fila "Onboarding → Reiniciar" la invoca, borra la clave y vuelve a mostrar el onboarding.
- La clave se expone como `STORAGE_KEYS.onboarding` en `src/lib/storage.ts` (fuente única, sustituyendo la constante local de OnboardingScreen).
- Se mantiene el flujo existente: si la clave existe, la app arranca directa en Scanner.

## No entra en T20
- Rediseño visual del onboarding.
- Onboarding con imágenes/sliders nativos (sin dependencias nuevas).
- Cambios en ScannerScreen o en el flujo de captura.
- Navegación nueva fuera del overlay del onboarding.

## Criterios de aceptación
- Los escenarios de `specs/onboarding-complete/spec.md` pasan.
- `npm run typecheck && npm run test` sigue en verde.
- Sin dependencias nuevas.
- Primera instalación → onboarding visible; después de terminar → app directa.
- Reiniciar desde Ajustes → onboarding visible de nuevo.
