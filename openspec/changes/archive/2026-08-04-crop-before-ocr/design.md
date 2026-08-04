# Diseño T19 — Recorte automático de bordes antes de OCR

## Variables
- **FUENTE ÚNICA** de provisión: `docs/roadmap.md`, `src/screens/ScannerScreen.tsx`, `src/features/ocr/ocrService.ts`.
- Dependencia nueva gestionada: `expo-image-manipulator` (oficial Expo SDK, instalado con `expo install`).

## Componentes
- `src/features/camera/cropToContent.ts` — helper nuevo.
  - `toGrayscale(pixels: Uint8Array): Uint8Array` — promedio RGB→gris (testeable puro).
  - `detectContentRect(gray: Uint8Array, width: number, height: number): [number, number, number, number]` — detecta región de contraste, devuelve [top, right, bottom, left] normalizados.
  - `cropImage(uri: string): Promise<string>` — orquesta thumbnail → detección → recorte → URI. Con fallback a la URI original en cualquier error.

## Algoritmo de detección (heurístico, sin OpenCV)
1. Thumbnail 64×64 con expo-image-manipulator (`resize`).
2. Obtener pixels del thumbnail: expo-image-manipulator devuelve URI; para leer pixels se usa `fetch(uri).arrayBuffer()` + decodificación manual simple del PNG/JPEG.
   - Para robustez: si la decodificación no está disponible, `detectContentRect` recibe pixels sintéticos o el thumbnail se omite → fallback a imagen completa.
3. Luminosidad por fila/columna: media de grises. Una fila/columna es "borde" si su luminosidad media difiere del promedio general > umbral y está en el exterior de la imagen.
4. Recorte con expo-image-manipulator (`crop`), con origen (left*width, top*height) y tamaño ((right-left)*width, (bottom-top)*height).

## ScannerScreen
- En `processImage`, tras `takePictureAsync`: `const croppedUri = await cropImage(photo.uri)` y usar `croppedUri` para `readImageAsBase64`.
- Si `cropImage` falla, devuelve la original — no cambia el flujo.

## Limpieza
- Si el recorte genera un archivo temporal nuevo, se elimina con `expo-file-system` (ya presente vía expo) o se ignora (el cacheDir se limpia solo).

## Límites
- No se añade UI, ni onboarding, ni ajustes de recorte.
- No se toca el flujo de doble cara ni el share.
- La detección es heurística de contraste; no detecta esquinas ni corrige perspectiva.
