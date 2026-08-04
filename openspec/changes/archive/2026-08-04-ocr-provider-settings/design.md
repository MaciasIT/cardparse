# Diseño T16 — Configuración visible de proveedor OCR en Ajustes

## Variables
- **FUENTE ÚNICA** de provisión: `doc` = `docs/roadmap.md`, `src/screens/SettingsScreen.tsx`, `src/lib/storage.ts`, `src/types/contact.ts`, `src/config/constants.ts`.
- No se inventa navegación ni almacenamiento nuevo sin dato.

## Componentes modificados
- `src/screens/SettingsScreen.tsx`: pasa de filas estáticas a estado local editable de configuración OCR.
- `src/screens/SettingsScreen.test.ts`: tests unitarios de lectura/escritura usando mock de `saveProviderConfig()` / `loadProviderConfig()` y validación de campos visibles.

## Campos visibles
- Endpoint.
- Modelo.
- Estado activo: “Activo” o “Desactivado”.
- Última guardada legible usando `Intl.DateTimeFormat` desde `src/config/constants.ts`.
- API key enmascarada: últimos 4 caracteres visibles, resto como `***`.

## Flujo
- Al abrir Ajustes, cargar configuración con `loadProviderConfig()`.
- Mostrar endpoint, modelo, API key enmascarada, estado activo y última guardada.
- Permitir editar y guardar con `saveProviderConfig()`.
- Permitir activar/desactivar el proveedor desde Ajustes sin perder config.
- Si falta `endpoint`, `model` o `apiKey`, mostrar estado “no configurado” y bloquear guardado.

## Contrato
- Entrada: `ProviderConfig` leída desde storage.
- Salida: objeto persistido mediante `saveProviderConfig()` tras validación básica.
- Cancelación: cambios no guardados no escriben en storage.
- Desactivación: `enabled = false` se guarda; `ScannerScreen` consulta esta bandera y bloquea captura sin eliminar la config.

## Límites
- Solo edita configuración OCR; no modifica permisos ni onboarding.
- No introduce providers predefinidos ni wizard en T16.
- Sin navegación nueva.
