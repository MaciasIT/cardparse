# T14 — OCR real externo vía proveedor configurable

## Problema
El flujo actual escanea simulando captura: `ScannerScreen` emite `file://demo-capture.jpg` y el parser recibe texto preescrito. Eso no satisface HU-01 ni HU-04.

## Solución propuesta
Conectar la captura real de imagen (`CameraView.takePictureAsync()`) con un proveedor OCR configurable por el usuario: OpenRouter primero como implementación concreta. Se mantiene el parser actual como motor de normalización.

## Alcance T14
- CAPA nueva `src/features/ocr/` con cliente HTTP reutilizable.
- Captura real desde cámara, encode a base64 y envío JSON al proveedor.
- Transformador canónico `normalizeOcrResponse()` para envolver respuestas de proveedor.
- Fin de la simulación: camino feliz real `captura -> OCR externo -> parser -> contacto`.
- Persistencia de `ProviderConfig` en Ajustes.
- Timeout, reintentos y manejo de errores sin crash.
- Medición y logging de latencia en `ScanMetadata.processingMs`.
- Cobertura mínima y documentación.

## No entra en T14
- MLKit local como OCR device-side.
- Recorte automático de tarjeta.
- Doble cara.
