# Diseño T15 — Confirmación y edición mínima antes de guardar

## Variables
- **FUENTE ÚNICA** de provisión: `doc` = `docs/roadmap.md`, `src/screens/ScannerScreen.tsx`, `src/features/history/useHistory.ts`, `src/types/contact.ts`.
- No se inventa navegación nueva sin dato.

## Componentes nuevos
- `src/screens/ReviewScreen.tsx`: pantalla mínima editable a partir de un `Contact`.
- `src/screens/ReviewScreen.test.ts`: tests del flujo edición, confirmación, cancelación y retorno a captura con mock de `useHistory`.

## Componentes modificados
- `src/screens/ScannerScreen.tsx`: tras OCR y parser, mostrar `ReviewScreen` en `Modal` nativo controlado por estado local; confirmar llama a `add(contact)`, cancelar cierra el modal y devuelve al flujo de captura.

## Mecanismo de presentación
- Modal nativo desde `ScannerScreen`.
- Cierre por callback directo: `onConfirm` y `onCancel`.
- No se introduce navegación adicional en tabs ni stack global.
- Al confirmar o cancelar, el modal se cierra y el usuario permanece en `ScannerScreen` sin perder el estado de captura.

## Contrato
- Entrada: `Contact` parseado desde OCR.
- Validación mínima: si `id` está vacío o no es string válido, `ReviewScreen` genera uno antes de confirmar.
- Salida: `Contact` confirmado/guardado vía `add(contact)`.
- Cancelación: cierra modal y retorna a `ScannerScreen` sin persistir.

## Límites
- Solo edición de campos: `name`, `company`, `phone`, `email`, `website`, `note`.
- Sin eliminación ni edición avanzada en T15.
- Sin rutas adicionales en navigation global.
