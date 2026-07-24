# CardParse

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![React Native](https://img.shields.io/badge/React_Native-0.76.6-61DAFB?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~52.0.0-000020?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0.0-764ABC?logo=redux)](https://zustand-demo.pmnd.rs/)

Escanea tarjetas de visita físicas, extrae datos con IA y genera vCards listas para importar.

## Estado actual

- **Tanda 1 completada**: scaffold ejecutable con navegación base.
- **Typecheck**: `tsc --noEmit` passing.
- **Commit real**: `8d6751c` en `main`.
- **Fase 5 en curso**: implementación por tandas hasta MVP navegable.

## Stack

| Componente | Tecnología |
|-----------|-----------|
| App | Expo `~52.0.0` |
| Runtime | React Native `0.76.6` |
| Lenguaje | TypeScript `5.5.4` |
| Navegación | `@react-navigation/native` + bottom tabs |
| Estado | Zustand `5.0.0` |
| Almacenamiento local | MMKV |
| Cámara / Imagen | Expo Camera / Image Picker |
| Contactos / Share | Expo Contacts / React Native Share |

## Documentación

- **Backlog/plan**: `docs/plan.md`
- **UX/design**: `docs/marketing/design.md`
- **Copy/pitch**: `docs/marketing/copy.md`
- **Growth**: `docs/marketing/growth.md`
- **User docs**: `docs/marketing/docs.md`
- **Tandas**: `docs/tandas/tanda-01.md`

## Scripts

```bash
npm run android
npm run ios
npm run typecheck
npm run test
npm run ci:check
```

## Licencia

MIT
