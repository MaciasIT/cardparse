# CardParse — Tanda 33: Estabilizar tests de ScannerScreen

## Blocker previo
T32 quedó cerrado con deuda reducida y reintentos saneados, pero `ScannerScreen.test.tsx` sigue con 1 fallo:
- `tras capturar ambas caras abre el Review unificado` hace timeout esperando `Revisar contacto`.

Diagnóstico provisional: no es solo `act()`/timing. El flujo en test no llega a abrir `ReviewScreen` pese a capturar A y B.

## Objetivo
- Hacer que el flujo “captura A → captura B → Review” sea estable en test.
- No cambiar comportamiento de producción si no es estrictamente necesario.
- Dejar un test verde que cubra la transición A→B→Review y la cancelación A→idle.

## Criterios de éxito
- `npm test` pasa en verde.
- `npm run typecheck` pasa sin errores.
- No se tocan parser/ocr base.
- No se añaden pantallas nuevas.
- Se documentan 1-2 lecciones aprendidas sobre `act()`/timing/state en `ScannerScreen`.

## Alcance
- Enfoque en `src/screens/ScannerScreen.tsx` y `src/screens/ScannerScreen.test.tsx`.
- Ajustes permitidos: mocks, helpers de espera, reducción de asincronía innecesaria en handlers, separación de lógica para facilitar el testeo.
- Queda fuera: reescritura completa de scanner o cambio de arquitectura de batch.

## Pasos propuestos
1. Reproducir el fallo exacto y registrar logs de texto para confirmar por qué no aparece `Revisar contacto`.
2. Revisar `handleCaptureBack`, `setPendingContact`, `ReviewScreen` y props `visible/onConfirm/onCancel`.
3. Aplicar la corrección mínima en componente o test que restaure el flujo esperado.
4. Reintentar `npm test` hasta pasar.
5. Cerrar con commit y, si procede, T34.
