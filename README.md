# CardParse

[![Expo](https://img.shields.io/badge/Expo-SDK_52-000020?logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.76.6-61DAFB?logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-11%2F11_green-success)](#)

Escanea tarjetas de visita físicas, extrae datos con IA y genera vCards listas para importar en la agenda del dispositivo.

## Estado del proyecto

- **Último commit**: `75e7e45` en `main`
- **Tandas completadas**: T1–T30
- **Tanda en curso**: T31 — tests batch y pantalla dedicada de lote
- **Tests**: 11/11 suites pasan (`npm run test`)
- **Typecheck**: limpio (`npm run typecheck`)
- **Build Android**: EAS preview/internal disponible; también `expo run:android` para builds locales
- **Próximo hito**: finalizar T31 y definir T32

## Qué hace hoy

- Captura de tarjeta con cámara
- Selección desde galería
- Parsing de contacto y generación de vCard
- Historial local navegable con búsqueda
- Detalle de contacto con acciones nativas
- Export/compartir vía contactos y share nativo
- Onboarding y ajustes funcionales
- Idioma ES/EN persistente
- Guardado en agenda del dispositivo
- Lote de escaneo con cola persistente, progreso, backoff y recuperación de estado
- Tests de batch y pantalla dedicada de lote (T31 en curso)

## Stack

| Componente | Tecnología | Nota |
|-----------|-----------|------|
| App | Expo SDK 52 | |
| Runtime | React Native 0.76.6 | |
| Lenguaje | TypeScript 5.6 | Estricto |
| Navegación | React Navigation 7 (`native-stack`) | |
| Estado | Zustand 5 | |
| Almacenamiento | MMKV | |
| Cámara / Imagen | Expo Camera / Image Picker | |
| Contactos / Share | Expo Contacts / React Native Share | |
| Tests | Jest | |
| Build Android | EAS preview/internal + `expo run:android` | |

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
    ocr/
    parser/
    settings/
  lib/
  screens/
  types/
docs/
  roadmap.md
  tandas/
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

## Build en Android

CardParse se entrega como build interna de EAS y también como build local.

- **EAS preview/internal**: `eas build --profile preview --platform android`
- **Build local**: `npm run android` con emulador o dispositivo conectado
- El proyecto incluye `eas.json` con perfiles `development`, `preview` y `production`
- `app.json` define permisos Android de cámara y contactos, y `minSdkVersion` 24

## Licencia

MIT
