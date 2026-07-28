# Diseño T14 — OCR real externo

## Variables
- **FUENTE ÚNICA** de provisión: `doc` = `docs/roadmap.md`, `src/features/parser/contactParser.ts`, `src/screens/ScannerScreen.tsx`, `src/lib/storage.ts`.
- No hay datos inventados: endpoints y contratos se definen a partir del stack actual.

## Componentes nuevos
- `src/features/ocr/ocrService.ts`: cliente HTTP contra proveedor configurado.
- `src/features/ocr/__tests__/ocrService.test.ts`: validación del cliente y casos de error.
- Transformador `normalizeOcrResponse()`: mapea `{ rawText, processingMs }` desde cualquier wrapper de proveedor.

## Contrato OCR externo
```
request:
  method: POST
  headers:
    Authorization: Bearer <apiKey guardada localmente>
    Content-Type: application/json
  body:
    {
      model: <modelo configurado>,
      image_base64: <captura encode base64>,
      max_tokens: 512
    }

response objetivo:
  { rawText: string, processingMs?: number }
```

Si el proveedor devuelve otro wrapper, `normalizeOcrResponse()` lo reduce al mismo shape. No se introduce parsing de formatos específicos más allá de extraer `rawText`.

## Captura real
- `ScannerScreen` usa `CameraView.takePictureAsync()` cuando hay proveedor activo.
- La imagen se encodea a base64 en memoria antes del envío.
- Ruta actual `handleSimulatedCapture` permanece hasta el commit de apply; desde apply se elimina el botón simulado.

## Configuración proveedor
- Reutilizo `ProviderConfig` y `saveProviderConfig`/`loadProviderConfig` desde `src/lib/storage.ts`.
- Verifico en `SettingsScreen` si existe formulario de proveedor; si no existe, se deja como trabajo pendiente fuera de T14.

## Robustez
- Timeout por petición.
- Reintentos acotados (`max 2 reintentos`).
- Cancelación de petición en curso cuando el usuario pulsa back.
- Manejo de error sin crash y retroacción visual en scanner.

## Límites
- No se introduce librería OCR device-side.
- No se agrega backend propio.
- No se modifica `contactParser`: solo se conecta su entrada.
