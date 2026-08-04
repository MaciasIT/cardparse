# Diseño T18 — Compartir sin guardar desde la Review

## Variables
- **FUENTE ÚNICA** de provisión: `docs/roadmap.md`, `src/screens/ReviewScreen.tsx`, `src/features/export/share.ts`, `src/features/export/vcard.ts`, `src/types/contact.ts`.
- No se inventa navegación ni almacenamiento nuevo sin dato.

## Componentes modificados
- `src/screens/ReviewScreen.tsx`: añade tercera acción "Compartir" en la fila de acciones.

## Reutilización
- `shareContactVCard(contact)` de `src/features/export/share.ts` — NO se modifica.
- `ensureContact(form)` ya normaliza el contacto antes de confirmar; se reutiliza para compartir.

## Flujo
1. `ReviewScreen` recibe opcionalmente `onShare?: (contact: Contact) => void` (la acción no es obligatoria; si no se pasa, el botón no se muestra).
2. Al pulsar "Compartir": `onShare(ensureContact(form))`.
3. `ScannerScreen` y cualquier pantalla que monte la Review deciden la implementación:
   - Por defecto: `shareContactVCard(contact)`.
   - No se llama a `onConfirm` → no se guarda.
4. Deshabilitado si `form.name` está vacío tras sanitizar, con texto de ayuda visible.

## Contrato
- Entrada: contacto editado en el formulario.
- Salida: vCard compartida vía share nativo.
- Sin persistencia: compartir nunca llama a `onConfirm` ni escribe en storage.
- El modal permanece abierto tras compartir (no se cierra).

## Límites
- No modifica `share.ts` ni `vcard.ts`.
- No cambia el flujo Confirmar (guardar).
- No añade estado de "compartido" ni historial de comparticiones.
