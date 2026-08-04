# T19 — Recorte automático de bordes antes de OCR

## Why
Las fotos de tarjetas tomadas con cámara suelen incluir bordes de mesa, fondo o pulgares — ruido que degrada la precisión del OCR. Recortar al área útil de la imagen antes de enviarla al proveedor mejora la tasa de acierto sin cambiar el flujo de captura. Esta tanda implanta el recorte usando `expo-image-manipulator` (librería oficial Expo SDK) como dependencia gestionada, sin añadir librerías de terceros.

## What Changes
- Se añade `expo-image-manipulator` al proyecto (vía `expo install expo-image-manipulator` — librería oficial del SDK gestionado).
- Nuevo helper `src/features/camera/cropToContent.ts`:
  - `toGrayscale(pixels: Uint8Array): Uint8Array` — función pura: convierte RGBA→gris. Testeable.
  - `detectContentRect(gray: Uint8Array, width, height): [number,number,number,number]` — función pura: detecta región de mayor contraste en pixels de ejemplo. Testeable con datos sintéticos.
  - `cropImage(uri: string): Promise<string>` — modo automático por defecto: recorta un 8% de cada borde de la imagen (elimina bordes negros típicos de cámara). Si algo falla, devuelve la URI original.
- `detectContentRect` queda preparada para una versión futura con acceso a pixels raw (cuando se añada una librería de decodificación). El algoritmo ya está implementado y testeable.
- `ScannerScreen` llama a `cropImage()` en `processImage` justo después de capturar, antes de codificar a base64.
- Sin dependencias de terceros: solo expo-image-manipulator (oficial Expo SDK).

## No entra en T19
- Recorte con detección de bordes perfecta (esquinas exactas en perspectiva).
- Enderezamiento de perspectiva (skew correction).
- Reconocimiento de bordes de tarjeta vs bordes de foto (asume tarjeta centrada).
- Onboarding o UI nueva.

## Criterios de aceptación
- Los escenarios de `specs/crop-before-ocr/spec.md` pasan.
- `npm run typecheck && npm run test` sigue en verde.
- `expo-image-manipulator` instalado con `expo install` (no npm).
- El flujo sin recorte (sin bordes detectables) no rompe la captura.