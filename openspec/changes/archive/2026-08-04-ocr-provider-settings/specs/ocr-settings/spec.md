# Spec T16 — Configuración visible de proveedor OCR en Ajustes

## ADDED Requirements

### Requirement: Configuración OCR visible y persistente en Ajustes
`SettingsScreen` SHALL mostrar la configuración OCR actual desde `loadProviderConfig()` y SHALL permitir editar y guardar endpoint, modelo, API key enmascarada, estado activo y última guardada legible usando `saveProviderConfig()`.

#### Scenario: Ajustes muestra la configuración almacenada
- Given existe una `ProviderConfig` guardada en AsyncStorage
- When el usuario abre Ajustes
- Then ve endpoint, modelo, API key enmascarada con últimos 4 caracteres visibles, estado activo y última guardada legible

#### Scenario: El usuario guarda cambios válidos
- Given el usuario edita endpoint, modelo y API key
- When pulsa guardar
- Then la app valida campos obligatorios
- And `saveProviderConfig()` persiste el nuevo objeto
- and la pantalla muestra estado activo y última guardada actualizada

#### Scenario: La app advierte si falta configuración obligatoria
- Given falta `endpoint`, `model` o `apiKey`
- When el usuario abre Ajustes
- Then la pantalla indica proveedor no configurado
- And `ScannerScreen` sigue bloqueando captura hasta configurar

#### Scenario: El usuario activa/desactiva el proveedor desde Ajustes
- Given existe una `ProviderConfig` guardada
- When el usuario cambia el estado activo en Ajustes
- Then `saveProviderConfig()` persiste `enabled = false` sin eliminar la config
- And `ScannerScreen` consulta `enabled` y bloquea la captura cuando está desactivado

## Criterios de aceptación
- Los 4 escenarios pasan.
- `npm run typecheck && npm run test` sigue en verde.
- No se añaden dependencias nuevas.
- No se duplica lógica de storage.
