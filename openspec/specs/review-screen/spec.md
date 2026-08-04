# review-screen Specification

## Purpose
TBD - created by archiving change review-before-save. Update Purpose after archive.
## Requirements
### Requirement: Revisión editable antes de guardar
El flujo Scanner SHALL presentar un `Modal` nativo editable con los datos extraídos por OCR y parser antes de persistir, permitiendo confirmar, cancelar y volver a capturar sin perder el estado.

#### Scenario: Usuario revisa y confirma contacto
- Given el OCR y parser generan un `Contact` con nombre y teléfono
- When el usuario abre la revisión desde Scanner
- Then ve los campos editables del contacto en `ReviewScreen`
- And al confirmar se guarda el contacto revisado mediante `add(contact)`
- And el modal se cierra y el usuario permanece en Scanner

#### Scenario: Usuario revisa y cancela
- Given el usuario está en la revisión del contacto
- When pulsa cancelar
- Then no se guarda ningún contacto nuevo
- And el modal se cierra
- And el usuario puede volver a capturar inmediatamente

#### Scenario: Usuario revisa, cancela y captura otra tarjeta
- Given el usuario cancela la revisión de un contacto
- When captura otra tarjeta
- Then la app vuelve a ejecutar OCR sobre la nueva imagen
- And el flujo se repite sin residuos del contacto anterior

#### Scenario: Edición de campos vacíos
- Given el parser solo detecta nombre
- When el usuario completa email y teléfono en revisión
- Then se guarda el contacto completo con los campos editados

#### Scenario: Validación mínima previa al guardado
- Given el parser devuelve un contacto sin `id` válido
- When el usuario confirma en revisión
- Then `ReviewScreen` genera un identificador válido
- And el guardado usa ese identificador

