# CardParse — Tanda 31: Tests batch y pantalla dedicada de lote

Objetivo: convertir el batch de CardParse en un flujo testeable y visiblemente independiente, sin mezclar la UI del scanner y la del lote.

## Criterios de éxito
- `npm run typecheck` pasa sin errores.
- `npm run test` pasa sin errores.
- Existe `src/screens/BatchScreen.tsx` con vista dedicada del lote.
- `useBatchQueue` tiene coverage de reintentos, backoff, limpiado y recuperación.
- El flujo Scanner → Batch → Review/Share está separado por pantalla/navegación.
- Commit único en `main` con mensaje: `feat: T31 — tests batch y pantalla dedicada de lote`.

## Alcance
- Crea `src/screens/BatchScreen.tsx`.
- Crea `src/features/batch/__tests__/useBatchQueue.test.ts`.
- Ajusta navegación si existe un stack dedicado; si no, añade una ruta/stack mínima.
- No altera la lógica de OCR ni del parser base.
- Mantiene contratos existentes de `useBatchQueue`.

## C0: Tests unitarios de batch
- `enqueue` agrega y persiste items respetando `BATCH_MAX_ITEMS`.
- `updateItem` parchea solo el item objetivo.
- `retryItem` respeta `BATCH_MAX_RETRIES` y calcula `nextRetryAt`.
- `clear` vacía la cola.
- `summary` refleja `done`, `pending`, `failed`, `processing`.
- Estado de recuperación al leer storage se simula con helpers/mocks.

## C1: Pantalla BatchScreen
- Muestra lista de items con estado visual.
- Muestra progreso global (`done/total`).
- Botones por item: reintentar, eliminar.
- Botón global: limpiar lote.
- Navegación clara de regreso al Scanner.

## C2: Integración mínima
- Añade ruta/stack para `BatchScreen` sin borrar el acceso rápido actual desde Scanner.
- Al tocar un item fallido desde Scanner, permite navegar a BatchScreen para reintentar.
- Al confirmar un item desde Batch, vuelve automáticamente al siguiente item pendiente.

## C3: UX mínima del lote
- Estados vacíos: “Sin items en el lote” con acción para volver a escanear.
- Estado con errores: contador claro y acción principal de reintento.
- Progreso persistente: al salir y volver a BatchScreen, se mantiene la cola y el progreso.

## C4: Verificación
- `npm run typecheck`
- `npm run test`
- Ver manualmente: agregar items, simular errores, reintentar, navegar Scanner↔Batch, limpiar.
- Reporta si el flujo se siente redundante o si el progreso se pierde al cambiar de tab.
