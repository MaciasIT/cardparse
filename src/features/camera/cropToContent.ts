/**
 * CardParse — Recorte automático de imagen antes de OCR.
 *
 * T19: elimina bordes de cámara (margen fijo 8%) de la imagen capturada.
 * Incluye detectContentRect como función pura preparada para una versión
 * futura con decodificación de pixels raw.
 */
import * as ImageManipulator from 'expo-image-manipulator';

const CROP_MARGIN = 0.08; // 8% de cada borde
const MIN_DIMENSION = 100; // px — por debajo no se recorta
const MAX_OCR_DIMENSION = 2048; // px — limita ancho/alto para reducir base64 y mejorar rendimiento OCR

/**
 * Convierte un buffer RGBA (4 bytes/pixel) a escala de grises
 * usando promedio simple (R+G+B)/3. Ignora el canal alpha.
 */
export function toGrayscale(pixels: Uint8Array): Uint8Array {
  const count = Math.floor(pixels.length / 4);
  const gray = new Uint8Array(count);
  for (let i = 0; i < count; i++) {
    const offset = i * 4;
    gray[i] = Math.round((pixels[offset] + pixels[offset + 1] + pixels[offset + 2]) / 3);
  }
  return gray;
}

type NormalizedRect = [number, number, number, number]; // [top, right, bottom, left] como fracción [0..1]

/**
 * Detecta el rectángulo de contenido en una imagen en escala de grises.
 *
 * Algoritmo: calcula la luminosidad media de cada fila y columna.
 * Busca la primera fila/columna desde cada borde cuya luminosidad supere
 * un umbral (20% por encima del mínimo global), lo que indica el inicio
 * del contenido. Si no se encuentra un borde claro, se usa el borde de la imagen.
 *
 * @param gray — pixels en gris (1 byte/pixel), row-major.
 * @param width — ancho en pixels del thumbnail.
 * @param height — alto en pixels del thumbnail.
 * @returns [top, right, bottom, left] normalizado a [0..1].
 */
export function detectContentRect(
  gray: Uint8Array,
  width: number,
  height: number,
): NormalizedRect {
  // Luminosidad media por fila
  const rowAvg = new Float64Array(height);
  for (let y = 0; y < height; y++) {
    let sum = 0;
    for (let x = 0; x < width; x++) {
      sum += gray[y * width + x];
    }
    rowAvg[y] = sum / width;
  }

  // Luminosidad media por columna
  const colAvg = new Float64Array(width);
  for (let x = 0; x < width; x++) {
    let sum = 0;
    for (let y = 0; y < height; y++) {
      sum += gray[y * width + x];
    }
    colAvg[x] = sum / height;
  }

  const overallMin = Math.min(...rowAvg, ...colAvg);
  const threshold = overallMin + (255 - overallMin) * 0.2;

  // Buscar desde cada borde
  let top = 0;
  for (let y = 0; y < height; y++) {
    if (rowAvg[y] >= threshold) {
      top = y;
      break;
    }
  }
  let bottom = height;
  for (let y = height - 1; y >= 0; y--) {
    if (rowAvg[y] >= threshold) {
      bottom = y + 1;
      break;
    }
  }
  let left = 0;
  for (let x = 0; x < width; x++) {
    if (colAvg[x] >= threshold) {
      left = x;
      break;
    }
  }
  let right = width;
  for (let x = width - 1; x >= 0; x--) {
    if (colAvg[x] >= threshold) {
      right = x + 1;
      break;
    }
  }

  return [
    top / height,
    right / width,
    bottom / height,
    left / width,
  ];
}

export async function cropImage(uri: string): Promise<string> {
  try {
    const meta = await ImageManipulator.manipulateAsync(uri, [], { format: ImageManipulator.SaveFormat.PNG });
    let width = meta.width;
    let height = meta.height;

    if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
      return uri;
    }

    const cropWidth = Math.max(MIN_DIMENSION, Math.round(width * (1 - CROP_MARGIN * 2)));
    const cropHeight = Math.max(MIN_DIMENSION, Math.round(height * (1 - CROP_MARGIN * 2)));
    const cropped = await ImageManipulator.manipulateAsync(
      uri,
      [{ crop: { originX: Math.round(width * CROP_MARGIN), originY: Math.round(height * CROP_MARGIN), width: cropWidth, height: cropHeight } }],
      { format: ImageManipulator.SaveFormat.PNG },
    );

    const croppedWidth = cropped.width ?? cropWidth;
    const croppedHeight = cropped.height ?? cropHeight;
    if (croppedWidth <= MAX_OCR_DIMENSION && croppedHeight <= MAX_OCR_DIMENSION) {
      return cropped.uri;
    }

    const resizeScale = Math.min(MAX_OCR_DIMENSION / croppedWidth, MAX_OCR_DIMENSION / croppedHeight);
    const resizeWidth = Math.max(MIN_DIMENSION, Math.round(croppedWidth * resizeScale));
    const resizeHeight = Math.max(MIN_DIMENSION, Math.round(croppedHeight * resizeScale));
    const resized = await ImageManipulator.manipulateAsync(
      cropped.uri,
      [{ resize: { width: resizeWidth, height: resizeHeight } }],
      { format: ImageManipulator.SaveFormat.PNG },
    );

    return resized.uri;
  } catch {
    return uri;
  }
}