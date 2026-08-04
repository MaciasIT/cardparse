# T17 — Escaneo de doble cara (Cara A + Cara B)

## Why
Las tarjetas de visita suelen llevar información en ambas caras (anverso: nombre y cargo; reverso: email, teléfono, web o dirección). Hoy `ScannerScreen` captura una sola foto y `parseContact` procesa un único texto, perdiendo datos del reverso. Esta tarea añade el flujo Cara A → Cara B → Review unificado para completar la HU-01b, sin tocar el resto de la app.

## What Changes
- `ScannerScreen` mantiene estado de fase: `idle` → `front-captured` → `back-captured`.
- Primera captura: se procesa el OCR, se guarda el texto de la cara A y se muestra acción "Capturar cara B" (no abre Review todavía).
- Segunda captura: se procesa el OCR de la cara B, se combinan ambos textos y se abre el Review unificado.
- Nuevo helper puro `combineSides(frontText, backText)` que fusiona ambos textos OCR respetando el orden y sin duplicar separadores.
- `parseContact` recibe el texto combinado; `ScanMetadata` guarda `rawTextFront` y `rawTextBack`.
- `Contact.source` queda en `'both'` cuando el contacto proviene de dos caras.
- Botón "Rehacer cara A" disponible tras capturar la cara B, sin perder la cara B ya escaneada.

## Alcance T17
- `src/screens/ScannerScreen.tsx`.
- Nuevo helper `src/features/parser/combineSides.ts` (o dentro de parser si es más corto).
- `src/screens/ScannerScreen.test.tsx` o tests del helper.

## No entra en T17
- Recorte automático de la imagen (T19).
- Compartir sin guardar (T18).
- Onboarding con tutorial de doble cara (T20).
- Cambios en ReviewScreen o en navegación global.

## Criterios de aceptación
- Los escenarios de `specs/double-side/spec.md` pasan.
- `npm run typecheck && npm run test` sigue en verde.
- No se añaden dependencias nuevas.
- El usuario que solo quiere una cara puede cancelar tras la cara A: el flujo vuelve al estado inicial sin abrir el Review.
