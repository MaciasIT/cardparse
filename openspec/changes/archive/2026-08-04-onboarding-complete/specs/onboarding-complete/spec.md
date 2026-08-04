# Spec T20 — Onboarding completo

## ADDED Requirements

### Requirement: Onboarding de tres pasos
`OnboardingScreen` SHALL mostrar 3 pasos secuenciales: introducción, guardar/compartir y tutorial de doble cara, y SHALL persistir la finalización bajo `STORAGE_KEYS.onboarding`.

#### Scenario: El usuario recorre los tres pasos
- Given el onboarding está visible
- When el usuario pulsa "Siguiente" en el paso 1
- Then se muestra el paso 2
- When el usuario pulsa "Siguiente" en el paso 2
- Then se muestra el paso 3 (tutorial de doble cara)
- When el usuario pulsa "Empezar" en el paso 3
- Then se guarda la clave de onboarding
- And se llama a `onFinish`

#### Scenario: El onboarding no se muestra si ya se completó
- Given `STORAGE_KEYS.onboarding` existe
- When la app arranca
- Then el onboarding no se monta
- And la app arranca directamente en la pestaña Scanner

### Requirement: Montaje del onboarding en el arranque
`app/layout.tsx` SHALL comprobar la clave de onboarding al montar y mostrar el onboarding como overlay cuando no exista.

#### Scenario: Primera instalación muestra el onboarding sobre los tabs
- Given la clave de onboarding no existe
- When el layout se monta
- Then el onboarding se muestra sobre la navegación
- And las tabs no son interactivas hasta completar el onboarding

#### Scenario: Al terminar el onboarding se revela la app
- Given el onboarding está visible
- When el usuario completa el último paso
- Then el onboarding desaparece
- And la navegación queda visible e interactiva

### Requirement: Reinicio del onboarding desde Ajustes
`SettingsScreen` SHALL exponer una acción "Reiniciar" en la fila de onboarding que borre la clave y vuelva a mostrar el onboarding.

#### Scenario: El usuario reinicia el onboarding desde Ajustes
- Given la clave de onboarding existe
- When el usuario pulsa "Onboarding → Reiniciar" en Ajustes
- Then se borra `STORAGE_KEYS.onboarding`
- And el onboarding se muestra de nuevo

#### Scenario: Sin callback de reinicio la fila no queda rota
- Given `SettingsScreen` se usa sin `onRestartOnboarding`
- When se renderiza la fila de onboarding
- Then la fila muestra "Reiniciar" pero no rompe el render
- And pulsarla no hace nada destructivo

## Criterios de aceptación
- Los 6 escenarios pasan.
- `npm run typecheck && npm run test` sigue en verde.
- Sin dependencias nuevas.
