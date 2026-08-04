# Spec T14 — OCR real externo

## ADDED Requirements

### Requirement: OCR real desde Scanner
El cambio SHALL añadir captura real desde `ScannerScreen`, conversión a base64, envío a proveedor OCR configurable y normalización canónica de la respuesta en `rawText`.

#### Scenario: Captura con proveedor activo devuelve contacto parseado
- Given existe una `ProviderConfig` activa con endpoint, apiKey y model
- When el usuario captura una tarjeta desde `ScannerScreen` usando `takePictureAsync()`
- Then la imagen se codifica a base64 y se envía al proveedor
- And se recibe respuesta con `rawText`
- And `normalizeOcrResponse()` devuelve `{ rawText, processingMs }`
- And `parseContact(rawText)` genera un `Contact` con al menos nombre o teléfono detectado
- And `ScanMetadata.processingMs` registra la latencia medida

#### Scenario: Captura sin proveedor activo usa fallback y advierte
- Given no hay `ProviderConfig` activa
- When el usuario pulsa capturar
- Then la app muestra un aviso de que no hay proveedor configurado
- And no se envía imagen a ningún endpoint externo
- And el usuario puede ir a Ajustes para configurarlo

#### Scenario: Imagen con formato no soportado
- Given la imagen capturada no se puede codificar a base64 limpio
- When se intenta enviar
- Then no se envía al proveedor
- And se muestra un error claro
- And el usuario puede reintentar captura

#### Scenario: Respuesta del proveedor con wrapper desconocido se normaliza
- Given el proveedor devuelve `{ choices[0].message.content }` u otro wrapper
- When `normalizeOcrResponse()` procesa la respuesta
- Then extrae `rawText` del wrapper sin perder información útil
- And `parseContact(rawText)` sigue funcionando con el texto extraído

#### Scenario: Proveedor configurado inválido devuelve error controlado
- Given existe una `ProviderConfig` con endpoint inválido o apiKey vacía
- When se intenta enviar la imagen
- Then el flujo no crashea
- And se muestra un mensaje de error específico
- And se permite reintentar captura o editar manualmente

#### Scenario: Timeout o fallo de red no rompe el flujo
- Given la petición al proveedor excede timeout
- When se produce el fallo
- Then el estado `busy` vuelve a `false`
- And se muestra retroacción visual de error en scanner
- And el usuario puede reintentar sin perder la cámara

## Criterios de aceptación
- Los 6 escenarios anteriores pasan.
- `npm run typecheck && npm run test` sigue en verde.
- Se agrega test unitario de `normalizeOcrResponse()` y del cliente OCR.
- No se elimina la ruta existente de historial sin migración.
- No se modifica `contactParser` sin suite de regresión.
