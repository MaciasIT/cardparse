# CardParse — Tanda 30: Batch scanner robusto

Objetivo: convertir el lote actual en un flujo fiable, recuperable y exportable sin perder contexto cuando la app se cierra o falla un item.

## Criterios de éxito
- `npm run typecheck` pasa sin errores.
- Existe una pantalla/estado dedicado de lote con progreso real por item.
- Los reintentos usan backoff y no dejan la cola atascada.
- Si la app se cierra durante revisión/reprocesamiento, al abrir de nuevo se recupera el último item pendiente o la cola activa.
- El usuario puede exportar/guardar desde el flujo batch sin volver al flujo single.
- Tests/verificación acotados a la zona tocada.
- Commit único en `main` con mensaje: `feat: T30 — batch scanner robusto con recuperación y export directo`.

## Alcance
- Modifica solo features/batch y screens/batch si se crean.
- No toca parser/ocr base, contactos ni vCard existentes.
- Mantiene contratos actuales de `useBatchQueue` y `ScannerScreen`.

## C0: Contrato de cola ampliado
- Añade a `BatchItem`:
  - `nextRetryAt?: number`
  - `lastError?: string | null`
- Añade constantes/config:
  - `BACKOFF_BASE_MS = 1000`
  - `BACKOFF_MULTIPLIER = 2`
  - `MAX_RETRIES = 2`
- Ajusta `retryItem` para usar `attempts` y calcular `nextRetryAt`.

## C1: Progreso real por item
- Añade `summary.done` y `summary.processing` además de `pending` y `failed`.
- Expone un `progress` calculable: `done / total` cuando `total > 0`, con un helper puro.

## C2: Reintentos con backoff
- Implementa backoff exponencial:
  - reintento 1: 1s
  - reintento 2: 2s
- Si `nextRetryAt > now`, el item no se reintenta hasta entonces.
- Limpia `nextRetryAt` cuando el item pasa a `done`/`error`.

## C3: Recuperación de estado al arranque
- Persiste también `activeScanId` en storage cuando se entra en `processing`/`review`.
- Al montar `ScannerScreen`, si existe `activeScanId`, rehidrata batch y recupera el item activo.
- Si el item activo está en `review`, reabre la review con ese contacto.
- Si está en `processing` y tiene reintento pendiente, respeta `nextRetryAt`.

## C4: Export directo desde batch
- Permite `onConfirm` y `onShare` por item sin limpiar toda la cola.
- Al confirmar, marca el item como `done` y avanza al siguiente item fallido/pendiente sin cerrar el batch.
- Si el usuario cancela, vuelve al item anterior sin perder la cola.

## C5: UX mínima del batch
- Muestra contador claro: `done/total`, estado actual y siguiente acción.
- Botones visibles para:
  - continuar con el siguiente item pendiente/fallido
  - limpiar cola
  - salir manteniendo la cola persistida

## C6: Verificación
- `npm run typecheck`
- Revisa manualmente: captura batch, forzar error, reintentar, cerrar app, reabrir, confirmar item, share, limpiar cola.
- Reporta cualquier caso en el que la cola quede bloqueada o la review no se recupere.
