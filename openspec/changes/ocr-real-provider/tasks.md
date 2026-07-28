# Tareas T14 — OCR real externo

- [ ] 1. Crear carpeta `src/features/ocr/` y tipos mínimos del servicio OCR.
- [ ] 2. Implementar `normalizeOcrResponse()` con cobertura de wrapper e imágenes convertidas a base64.
- [ ] 3. Implementar `ocrService.ts` con cliente HTTP contra `ProviderConfig`, timeout y reintentos acotados.
- [ ] 4. Agregar tests unitarios: éxito, fallo de red, timeout, wrapper desconocido, imagen no codificable.
- [ ] 5. Modificar `ScannerScreen` para usar `CameraView.takePictureAsync()` cuando haya proveedor activo.
- [ ] 6. Integrar respuesta OCR normalizada con `parseContact(rawText)` y construir `ScanMetadata`.
- [ ] 7. Agregar ruta de fallback cuando no haya proveedor activo: aviso y camino a Ajustes.
- [ ] 8. Confirmar estado de `SettingsScreen`: si no tiene formulario de proveedor, documentar como fuera de T14.
- [ ] 9. Asegurar manejo de errores sin crash, retroacción visual en scanner y cancelación de petición en curso.
- [ ] 10. Ejecutar `npm run typecheck && npm run test`.
- [ ] 11. Commit con mensaje `feat: T14 — OCR real externo vía proveedor configurable`.
