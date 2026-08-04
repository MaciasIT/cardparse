# Tareas T18 — Compartir sin guardar desde la Review

- [x] 1. Añadir prop opcional `onShare?: (contact: Contact) => void` a `ReviewScreenProps`.
- [x] 2. Añadir acción "Compartir" en la fila de acciones de la Review (junto a Cancelar/Confirmar).
- [x] 3. Al pulsar Compartir: llamar `onShare(ensureContact(form))` sin cerrar el modal ni llamar a `onConfirm`.
- [x] 4. Deshabilitar Compartir si el nombre está vacío, con feedback visible.
- [x] 5. Conectar `onShare` en `ScannerScreen` con `shareContactVCard`.
- [x] 6. Escribir tests: compartir no guarda (no llama onConfirm), comparte el contacto editado, deshabilitado sin nombre.
- [x] 7. Ejecutar `npm run typecheck && npm run test`.
- [x] 8. Commit con mensaje `feat: T18 — compartir sin guardar desde la Review`.
