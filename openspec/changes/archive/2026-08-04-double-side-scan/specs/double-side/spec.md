# Spec T17 — Escaneo de doble cara

## ADDED Requirements

### Requirement: Captura secuencial de dos caras
`ScannerScreen` SHALL gestionar el escaneo en dos pasos: primero la cara A, después la cara B, combinando ambos textos OCR antes de abrir la revisión.

#### Scenario: El usuario escanea la cara A y se le ofrece capturar la cara B
- Given el proveedor OCR está configurado y activo
- When el usuario pulsa capturar la primera vez
- And el OCR devuelve texto para la cara A
- Then la app guarda el texto de la cara A
- And muestra la acción "Capturar cara B" en lugar de abrir la revisión
- And el texto extraído de la cara A queda visible en pantalla

#### Scenario: El usuario escanea ambas caras y llega a la revisión unificada
- Given la cara A ya está capturada
- When el usuario pulsa capturar la cara B
- And el OCR devuelve texto para la cara B
- Then la app combina los textos de ambas caras con `combineSides`
- And abre el Review unificado con el contacto parseado del texto combinado
- And `ScanMetadata` contiene `rawTextFront` y `rawTextBack`

#### Scenario: El usuario rehace la cara A sin perder la cara B
- Given ambas caras están capturadas
- When el usuario pulsa "Rehacer cara A"
- Then la app reinicia solo la cara A
- And conserva el texto de la cara B en memoria
- And vuelve al estado de espera de la cara A

#### Scenario: Una sola cara sigue funcionando si el usuario cancela tras la primera
- Given la cara A está capturada
- When el usuario cancela el flujo de doble cara
- Then la app descarta el texto de la cara A
- And vuelve al estado inicial sin abrir el Review

### Requirement: Combinación determinista de textos OCR
`combineSides` SHALL fusionar el texto de la cara A y el de la cara B en un único string con separación de línea, sin duplicar ni perder contenido.

#### Scenario: Combina dos textos con contenido distinto
- Given `frontText = "Ana López\nDirectora comercial"` y `backText = "ana@empresa.es\n+34 600 123 456"`
- When se llama a `combineSides(frontText, backText)`
- Then el resultado contiene ambos textos completos
- And mantiene el orden cara A antes de cara B

#### Scenario: Maneja caras vacías
- Given `backText` está vacío
- When se llama a `combineSides("texto", "")`
- Then el resultado es solo el texto de la cara A sin separadores extra

#### Scenario: Normaliza los espacios y saltos intermedios
- Given textos con espacios múltiples o saltos redundantes
- When se llama a `combineSides(frontText, backText)`
- Then el resultado no contiene espacios múltiples ni líneas vacías redundantes

## Criterios de aceptación
- Los 6 escenarios pasan.
- `npm run typecheck && npm run test` sigue en verde.
- No se añaden dependencias nuevas.
