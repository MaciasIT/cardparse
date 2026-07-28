# Tareas T15 — Confirmación y edición mínima antes de guardar

- [ ] 1. Crear tipos mínimos para props de `ReviewScreen`: `contact`, `onConfirm`, `onCancel`.
- [ ] 2. Implementar `ReviewScreen.tsx` con campos editables y acciones Confirmar/Cancelar usando `Modal` nativo.
- [ ] 3. Añadir validación mínima del `Contact` antes de confirmar (`id` válido, saneamiento básico).
- [ ] 4. Integrar `ReviewScreen` desde `ScannerScreen` tras `parseContact(rawText)`.
- [ ] 5. Persistir contacto confirmado usando `add(contact)` y retornar al flujo del scanner sin pérdida de estado.
- [ ] 6. Añadir tests unitarios con mock de `useHistory`: edición de campos, confirmación, cancelación y retorno a captura.
- [ ] 7. Ejecutar `npm run typecheck && npm run test`.
- [ ] 8. Commit con mensaje `feat: T15 — confirmación y edición mínima antes de guardar`.
