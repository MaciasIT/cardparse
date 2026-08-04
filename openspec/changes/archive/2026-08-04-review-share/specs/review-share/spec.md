# Spec T18 — Compartir sin guardar desde la Review

## ADDED Requirements

### Requirement: Acción Compartir en la pantalla de revisión
`ReviewScreen` SHALL ofrecer una acción "Compartir" que comparte el contacto editado vía el share nativo sin guardarlo en el historial.

#### Scenario: El usuario comparte el contacto editado sin guardar
- Given la Review está abierta con un contacto que tiene nombre
- When el usuario edita algún campo (p. ej. email) y pulsa "Compartir"
- Then se genera la vCard con los datos editados
- And se llama a `shareContactVCard(contactoEditado)`
- And NO se llama a `onConfirm`
- And el contacto no se guarda en el historial

#### Scenario: El usuario comparte un contacto recién escaneado sin confirmar
- Given la Review está abierta tras un escaneo
- When el usuario pulsa "Compartir" sin tocar el formulario
- Then la vCard se genera con los datos extraídos por OCR
- And el modal permanece abierto tras la compartición
- And el usuario puede seguir con "Cancelar" o "Confirmar"

#### Scenario: Compartir queda deshabilitado sin nombre
- Given la Review está abierta con un contacto sin nombre
- When el usuario intenta pulsar "Compartir"
- Then la acción está deshabilitada
- And se muestra feedback indicando que el nombre es obligatorio

### Requirement: Separación estricta entre compartir y guardar
La acción "Compartir" SHALL usar el mismo contacto normalizado que vería `onConfirm`, pero SIN persistir nada.

#### Scenario: Compartir no guarda aunque el usuario confirme después
- Given el usuario ha pulsado "Compartir" una vez
- When el usuario después pulsa "Confirmar"
- Then el contacto se guarda una única vez (la compartición previa no duplicó nada)
- And no hay efectos secundarios de la compartición sobre el historial

## Criterios de aceptación
- Los 4 escenarios pasan.
- `npm run typecheck && npm run test` sigue en verde.
- No se añaden dependencias nuevas.
- `shareContactVCard` no se modifica.
