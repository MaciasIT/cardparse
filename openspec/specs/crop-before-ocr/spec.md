# crop-before-ocr Specification

## Purpose
TBD - created by archiving change crop-before-ocr. Update Purpose after archive.
## Requirements
### Requirement: Recorte de imagen antes de OCR
`cropImage` SHALL recortar la imagen capturada eliminando bordes sin contenido útil antes de codificarla a base64 para el OCR.

#### Scenario: La imagen se recorta eliminando un margen de cada borde
- Given una imagen capturada
- When se llama a `cropImage(uri)`
- Then se recorta un 8% de cada borde de la imagen
- And la URI devuelta apunta a la imagen recortada

#### Scenario: La imagen es demasiado pequeña para recortar
- Given una imagen de menos de 100px en cualquier dimensión
- When se llama a `cropImage(uri)`
- Then la imagen se pasa sin recortar
- And la URI devuelta es la original

#### Scenario: Error en el recorte no bloquea la captura
- Given `expo-image-manipulator` falla o la URI no existe
- When se llama a `cropImage(uri)`
- Then se devuelve la URI original
- And el flujo de OCR continúa sin interrupción

### Requirement: Detección de bordes por contraste en thumbnail
`detectContentRect` SHALL analizar un thumbnail 64×64 en raw pixels (Uint8Array) y devolver las coordenadas normalizadas [top, right, bottom, left] de la región con mayor contraste.

#### Scenario: Detecta el rectángulo de contenido en pixels de ejemplo
- Given un thumbnail con bordes oscuros (luminosidad <30) y centro claro (>150)
- When se llama a `detectContentRect(pixels, width, height)
- Then las coordenadas excluyen las filas/columnas oscuras de los bordes
- And las coordenadas son normalizadas a [0.0, 1.0]

#### Scenario: Sin contraste suficiente devuelve la imagen completa
- Given un thumbnail uniforme (todos los pixels con luminosidad similar)
- When se llama a `detectContentRect`
- Then devuelve [0, 1, 1, 0] (sin recorte)

