# T15 — Confirmación y edición mínima antes de guardar

## Why
Tras T14, la app ya captura imagen real, envía a OCR y parsea un `Contact`. Falta el paso de calidad: el usuario debe poder revisar y corregir los datos antes de persistir, sin workflows inventados ni navegación nueva sin medida.

## What Changes
- Añade `ReviewScreen` mínimo con campos editables del contacto parseado.
- Modifica el flujo de `ScannerScreen` para mostrar revisión, confirmar guardado o cancelar sin perder la captura.
- Usa `useHistory().add(...)` como única vía de persistencia.
- Añade tests del flujo completo: parser -> edición -> guardado.
- No modifica estructura de tabs ni rutas.

## Alcance T15
- Pantalla `src/screens/ReviewScreen.tsx`.
- Integración condicional desde `ScannerScreen` mediante `Modal` nativo.
- Tests unitarios de edición, confirmación, cancelación y retorno a captura.

## No entra en T15
- Doble cara.
- Recorte automático.
- Cambio de navegación global.

## Criterios de aceptación
- Los escenarios de `specs/review-screen/spec.md` pasan.
- `npm run typecheck && npm run test` sigue en verde.
- No se modifica la navegación global.
- No se duplica lógica de guardado.
