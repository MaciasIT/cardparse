# T18 — Compartir sin guardar desde la Review

## Why
Hoy el usuario solo puede compartir un contacto desde el historial (`ContactDetailScreen`). Para compartir una tarjeta recién escaneada debe primero confirmar (guardar) y luego ir al detalle — un paso extra que además ensucia el historial con contactos que el usuario solo quería enviar una vez. Esta tarea añade "Compartir" directo desde la Review (HU-08), sin tocar el flujo de guardado.

## What Changes
- `ReviewScreen` gana una tercera acción: "Compartir", junto a "Cancelar" y "Confirmar".
- Al pulsar "Compartir" se genera la vCard del contacto **editado en el formulario** (mismos datos que se mostrarían al confirmar) y se abre el share nativo con `shareContactVCard()`.
- Compartir **no guarda** el contacto: no llama a `onConfirm`, no toca el historial, no persiste nada.
- El modal permanece abierto tras compartir (el usuario puede seguir editando o decidir guardar después), salvo que el share nativo cancele el flujo.
- La acción "Compartir" queda deshabilitada si el contacto no tiene nombre (campo obligatorio mínimo), con feedback visible.

## Alcance T18
- `src/screens/ReviewScreen.tsx`: añade acción "Compartir".
- `src/features/export/share.ts`: se reutiliza tal cual (sin cambios) — ya es la única fuente de share.
- Tests de ReviewScreen: el botón Compartir llama a share con el contacto editado y NO llama a onConfirm.

## No entra en T18
- Cambios en el share nativo (`shareContactVCard` se usa como está).
- Guardado automático tras compartir.
- Compartir desde el scanner directamente (sin Review).
- Cambios de navegación global.

## Criterios de aceptación
- Los escenarios de `specs/review-share/spec.md` pasan.
- `npm run typecheck && npm run test` sigue en verde.
- No se añaden dependencias nuevas.
- El flujo Confirmar (guardar) sigue funcionando sin cambios de comportamiento.
