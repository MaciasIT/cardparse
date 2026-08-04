# Tareas T20 — Onboarding completo

- [x] 1. Añadir `onboarding: '@cardparse/onboarding/done'` a `STORAGE_KEYS` en `src/lib/storage.ts`.
- [x] 2. Ampliar `OnboardingScreen` a 3 pasos (intro, guardar/compartir, doble cara) usando `STORAGE_KEYS.onboarding`.
- [x] 3. Escribir tests de OnboardingScreen: recorre 3 pasos, guarda la clave, no se muestra si ya completado.
- [x] 4. Montar el onboarding en `app/layout.tsx` como overlay con comprobación de clave al arrancar.
- [x] 5. Añadir `onRestartOnboarding` a `SettingsScreen` y hacer funcional la fila "Reiniciar".
- [x] 6. Escribir tests de SettingsScreen para la fila de reinicio (con y sin callback).
- [x] 7. Ejecutar `npm run typecheck && npm run test`.
- [x] 8. Commit con mensaje `feat: T20 — onboarding completo (3 pasos + montaje + reinicio)`.
