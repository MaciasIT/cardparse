# CardParse

[![Expo](https://img.shields.io/badge/Expo-SDK_52-000020?logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.76.6-61DAFB?logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-11%2F11_green-success)](#)

Escanea tarjetas de visita físicas, extrae datos con IA y genera vCards listas para importar en la agenda del dispositivo.

## Estado del proyecto

- **Último commit**: `faa4bd8` en `main`
- **Tandas completadas**: T1–T29
- **Tests**: 11/11 pasan (`npm run test`)
- **Typecheck**: limpio (`npm run typecheck`)
- **Build**: EAS preview OK, APK funcional en emulador Android
- **Próximo hito**: definir siguiente tanda priorizada

## Qué hace hoy

- Captura de tarjeta con cámara
- Selección desde galería
- Parsing de contacto y generación de vCard
- Historial local navegable
- Detalle de contacto con acciones nativas
- Export/compartir vía contactos y share nativo
- Onboarding y ajustes funcionales
- Idioma ES/EN persistente
- Guardado en agenda del dispositivo
- Lote de escaneo con cola, progreso y reintentos

## Qué falta para MVP real

| Tanda | Objetivo | Estado |
|-------|----------|--------|
| Definir T30 | Siguiente feature priorizada | ⬜ |

## Stack

| Componente | Tecnología |
|-----------|-----------|
| App | Expo SDK 52 |
| Runtime | React Native 0.76.6 |
| Lenguaje | TypeScript 5.6 |
| Navegación | React Navigation 7 (`native-stack`) |
| Estado | Zustand 5 |
| Almacenamiento | MMKV |
| Cámara / Imagen | Expo Camera / Image Picker |
| Contactos / Share | Expo Contacts / React Native Share |
| Tests | Jest |

## Estructura

```text
app/
  layout.tsx
src/
  components/
  config/
  features/
    batch/
    export/
    history/
    parser/
    settings/
  lib/
  screens/
  types/
docs/
  roadmap.md
```

## Scripts

```bash
npm run android
npm run ios
npm run typecheck
npm run test
npm run ci:check
```

## Roadmap

El plan completo de tandas está en `docs/roadmap.md`.

## Licencia

MIT
