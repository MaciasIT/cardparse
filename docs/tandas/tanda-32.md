# CardParse — Tanda 32: Export directo desde batch y limpieza de deuda técnica

Objetivo: cerrar el flujo batch para que el usuario pueda confirmar, compartir y avanzar sin volver al scanner, y reducir la deuda técnica de T30/T31 para mantener la base estable.

## Criterios de éxito
- `npm run typecheck` pasa sin errores.
- `npm run test` pasa sin errores.
- Desde el flujo batch se puede confirmar, compartir y seguir con el siguiente item sin perder el contexto del lote.
- Los handlers de cancelación y confirmación normalizan estados y limpian `activeScanId` sin reintentos extra.
- Se reduce deuda técnica relevante en `ScannerScreen`/`useBatchQueue` sin cambiar features.
- Commit único en `main` con mensaje: `feat: T32 — export directo desde batch y limpieza de deuda técnica`.

## Alcance
- Ajusta `ScannerScreen`, `ReviewScreen` y `useBatchQueue` solo si aporta claridad o robustez.
- No añade nuevas pantallas obligatoriamente.
- No cambia parser/ocr base.
- No modifica README ni roadmap.

## C0: Export directo desde batch
- Asegura que al confirmar un item batch:
  - se guarde en historial si corresponde;
  - se marque `done`;
  - se avance automáticamente al siguiente item pendiente/fallido;
  - se mantenga la cola visible sin cerrar el flujo.
- Asegura que `shareContactVCard` funcione como atajo sin guardado obligatorio.

## C1: Estados normalizados
- `handleReviewConfirm`, `handleReviewCancel` y `handleCancelDoubleSide` usan la misma helpers para:
  - limpiar `pendingContact`;
  - limpiar `frontText`/`backText`;
  - resetear `phase` a `idle`;
  - limpiar `activeScanId`;
  - cancelar acciones pendientes de OCR si aplica.
- Elimina ramas duplicadas o reset manuales dispersos.

## C2: Reintentos y backoff sin ruido
- `retryItem`/`retryDue` no reintentan items ya `done` o `saving`.
- `nextRetryAt` se limpia al pasar a `done`/`error` final.
- `runAll` no deja la UI en `loading` si no hay nada que reintentar.

## C3: Deuda técnica reducida
- Elimina código muerto o variables sin uso relevantes.
- Centraliza constants de batch en `useBatchQueue`.
- Reduce props/callbacks innecesarias en `ScannerScreen` si las hay.
- Mantiene contratos públicos compatibles.

## C4: Verificación
- `npm run typecheck`
- `npm run test`
- Prueba manual:
  - batch con 1 item OK;
  - batch con 1 item fallido y reintento;
  - share sin guardar;
  - cancelar desde review y desde scanner;
  - cerrar y reabrir para comprobar recuperación.
- Reporta cualquier edge case descubierto.
