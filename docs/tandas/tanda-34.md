# CardParse — Tanda 34: Export directo desde batch

## Por qué existe
T32 se cerró sin export directo porque un test de `ScannerScreen` quedó bloqueado por timing/`act()`. En lugar de meter más ruido en ese flujo, T34 implementa el criterio original C0 en una ruta separada.

## Objetivo
- Permitir compartir/salvar un contacto del lote sin necesidad de pasar por `ReviewScreen`.
- No cerrar el flujo batch; tras export, el usuario puede seguir con el siguiente item.
- Mantener contratos existentes: no borrar `ReviewScreen`, no cambiar parser/ocr.

## Criterios de éxito
- `npm run typecheck` pasa sin errores.
- `npm test` pasa, excepto el test documentado de ScannerScreen si sigue pendiente.
- Desde el batch se puede:
  - confirmar y guardar en historial;
  - compartir vCard directo sin guardado obligatorio;
  - avanzar al siguiente item pendiente/fallido sin perder el lote.
- No se introducen pantallas nuevas obligatorias.

## Alcance
- Afecta preferiblemente `useBatchQueue` y `ScannerScreen`.
- `shareContactVCard` ya existe; T34 es orquestación desde batch, no crear share desde cero.
- Queda fuera: flujo completo de onboarding/settings/parser/ocr.

## Opción A (recomendada, menos invasiva)
Agregar a `useBatchQueue`:
- `exportCurrent(contact)` -> marca `done` y dispara share/save sin abrir review.
- `nextItemAfterExport()` -> devuelve el siguiente item candidato para continuar.

Luego en `ScannerScreen`:
- nuevo botón “Exportar” en `batchBar` cuando hay item actual con `pendingContact`.
- `handleExportCurrent()` llama a `batch.exportCurrent(...)` y luego muestra `Alert.alert(..., [{ text: 'Siguiente', onPress: autoAdvance }])`.
- No se modifica `handleReviewConfirm` ni la ruta existente.

## Opción B (si prefieres atajar también el test)
Solo si aceptas deuda controlada:
- aislar `handleCaptureBack` en un hook/testable;
- mockear storage en test;
- entonces cerrar también el test pendiente.

Por ahora implemento Opción A y dejo Opción B documentada para T35.
