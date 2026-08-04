# T16 — Configuración visible de proveedor OCR en Ajustes

## Why
Hoy `SettingsScreen` solo muestra filas estáticas. El usuario no puede configurar el proveedor OCR desde la app, así que T14/T15 quedan sin interfaz de uso real fuera de código. Esta tarea cierra ese hueco sin inventar flujos nuevos.

## What Changes
- Amplía `SettingsScreen` para mostrar y editar la configuración OCR visible: endpoint, modelo, estado activo y última guardada legible.
- Usa `saveProviderConfig()` / `loadProviderConfig()` como fuente única de persistencia.
- Muestra desde `SettingsScreen` si el proveedor está activo o no, con feedback directo.
- Incluye escenario de desactivación/activación desde Ajustes.

## Alcance T16
- Pantalla `src/screens/SettingsScreen.tsx`.
- Persistencia mediante `saveProviderConfig()` / `loadProviderConfig()`.
- Información visible: endpoint, modelo, estado activo, última guardada y API key enmascarada con últimos 4 caracteres visibles.

## No entra en T16
- Onboarding nuevo.
- Selección por proveedores predefinidos como wizard.
- Cambios de navegación global.
- Nuevas pantallas fuera de Ajustes.

## Criterios de aceptación
- Los escenarios de `specs/ocr-settings/spec.md` pasan.
- `npm run typecheck && npm run test` sigue en verde.
- No se añaden dependencias nuevas.
- No se duplica lógica de storage.
