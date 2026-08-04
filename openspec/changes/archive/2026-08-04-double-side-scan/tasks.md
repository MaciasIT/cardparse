# Tareas T17 — Escaneo de doble cara

- [x] 1. Crear helper puro `combineSides(frontText, backText)` en `src/features/parser/combineSides.ts`.
- [x] 2. Escribir tests del helper: combina dos textos, maneja caras vacías, normaliza espacios/saltos.
- [x] 3. Añadir estado de fase (`idle | front-captured | back-captured`) y textos de ambas caras en `ScannerScreen`.
- [x] 4. Modificar primera captura: guardar texto cara A y mostrar "Capturar cara B" en vez de abrir Review.
- [x] 5. Añadir captura de cara B: combinar con `combineSides`, parsear y abrir Review unificado.
- [x] 6. Añadir acción "Rehacer cara A" sin perder la cara B.
- [x] 7. Rellenar `ScanMetadata.rawTextFront` y `rawTextBack`.
- [x] 8. Verificar que el flujo de una sola cara sigue intacto (cancelar tras cara A → vuelve a idle sin Review).
- [x] 9. Ejecutar `npm run typecheck && npm run test`.
- [x] 10. Commit con mensaje `feat: T17 — escaneo de doble cara (Cara A + Cara B)`.
