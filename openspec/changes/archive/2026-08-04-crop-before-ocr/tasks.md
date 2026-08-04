# Tareas T19 — Recorte automático de bordes antes de OCR

- [x] 1. Instalar `expo-image-manipulator` con `expo install`.
- [x] 2. Crear `src/features/camera/cropToContent.ts` con `toGrayscale` y `detectContentRect` (funciones puras).
- [x] 3. Escribir tests de `toGrayscale` y `detectContentRect` (bordes oscuros, imagen uniforme).
- [x] 4. Implementar `cropImage(uri)` orquestando recorte con margen fijo 8%, con fallback a URI original.
- [x] 5. Conectar `cropImage` en `ScannerScreen.processImage` antes del base64.
- [x] 6. Escribir test de integración: error de recorte no bloquea la captura (mock de cropImage).
- [x] 7. Ejecutar `npm run typecheck && npm run test`.
- [x] 8. Commit con mensaje `feat: T19 — recorte automático de bordes antes de OCR`.
