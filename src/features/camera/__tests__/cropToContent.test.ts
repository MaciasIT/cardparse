import { toGrayscale, detectContentRect, cropImage } from '../cropToContent';
import * as ImageManipulator from 'expo-image-manipulator';

jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn(),
  SaveFormat: { PNG: 'png', JPEG: 'jpeg' },
}));

const mockManipulate = ImageManipulator.manipulateAsync as jest.Mock;

describe('toGrayscale', () => {
  it('convierte RGBA a gris con promedio simple', () => {
    // Blanco: RGB(255,255,255)
    // Negro:  RGB(0,0,0)
    // Rojo:   RGB(255,0,0) → 85
    const rgba = new Uint8Array([
      255, 255, 255, 255, // pixel 0: blanco
      0, 0, 0, 255,       // pixel 1: negro
      255, 0, 0, 255,     // pixel 2: rojo
    ]);
    const gray = toGrayscale(rgba);
    expect(gray.length).toBe(3);
    expect(gray[0]).toBe(255); // blanco
    expect(gray[1]).toBe(0);   // negro
    expect(gray[2]).toBe(85);  // (255+0+0)/3
  });
});

describe('detectContentRect', () => {
  function makeGray(width: number, height: number, fill: number): Uint8Array {
    return new Uint8Array(width * height).fill(fill);
  }

  it('detecta un rectángulo central claro sobre fondo oscuro', () => {
    const w = 64;
    const h = 64;
    const gray = new Uint8Array(w * h).fill(20); // fondo oscuro

    // Región central clara: 20x20 desde (22,22)
    for (let y = 22; y < 42; y++) {
      for (let x = 22; x < 42; x++) {
        gray[y * w + x] = 200;
      }
    }

    const [top, right, bottom, left] = detectContentRect(gray, w, h);
    // top ≈ 22/64 ≈ 0.34
    // left ≈ 22/64 ≈ 0.34
    // bottom ≈ 42/64 ≈ 0.66
    // right ≈ 42/64 ≈ 0.66
    expect(top).toBeGreaterThan(0.3);
    expect(top).toBeLessThan(0.4);
    expect(left).toBeGreaterThan(0.3);
    expect(left).toBeLessThan(0.4);
    expect(bottom).toBeGreaterThan(0.6);
    expect(bottom).toBeLessThan(0.7);
    expect(right).toBeGreaterThan(0.6);
    expect(right).toBeLessThan(0.7);
  });

  it('devuelve imagen completa si toda la imagen es uniforme', () => {
    const gray = makeGray(64, 64, 128);
    const [top, right, bottom, left] = detectContentRect(gray, 64, 64);
    expect(top).toBe(0);
    expect(left).toBe(0);
    expect(bottom).toBe(1);
    expect(right).toBe(1);
  });

  it('devuelve coordenadas con bordes oscuros en extremos y contenido claro en centro', () => {
    const w = 64;
    const h = 64;
    const gray = new Uint8Array(w * h).fill(180);

    // 5 filas oscuras arriba
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < w; x++) gray[y * w + x] = 10;
    }
    // 5 filas oscuras abajo
    for (let y = h - 5; y < h; y++) {
      for (let x = 0; x < w; x++) gray[y * w + x] = 10;
    }
    // 5 columnas oscuras izquierda
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < 5; x++) gray[y * w + x] = 10;
    }
    // 5 columnas oscuras derecha
    for (let y = 0; y < h; y++) {
      for (let x = w - 5; x < w; x++) gray[y * w + x] = 10;
    }

    const [top, right, bottom, left] = detectContentRect(gray, w, h);

    // El contenido empieza en fila 5 (5/64 ≈ 0.078)
    expect(top).toBeCloseTo(5 / 64, 1);
    expect(left).toBeCloseTo(5 / 64, 1);
    // El contenido termina en fila 59 (59/64 ≈ 0.92≈1)
    expect(bottom).toBeCloseTo(59 / 64, 1);
    expect(right).toBeCloseTo(59 / 64, 1);
  });
});

describe('cropImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('recorta un margen fijo del 8% en cada borde', async () => {
    mockManipulate
      .mockResolvedValueOnce({ uri: 'file://meta', width: 640, height: 480 }) // primera llamada: metadata
      .mockResolvedValueOnce({ uri: 'file://cropped', width: 538, height: 403 }); // segunda: recorte

    const result = await cropImage('file://test.jpg');
    expect(result).toBe('file://cropped');
    expect(mockManipulate).toHaveBeenCalledTimes(2);

    const cropAction = mockManipulate.mock.calls[1][1][0];
    expect(cropAction).toEqual({
      crop: {
        originX: Math.round(640 * 0.08),
        originY: Math.round(480 * 0.08),
        width: 640 - Math.round(640 * 0.08) * 2,
        height: Math.max(100, Math.round(480 * (1 - 0.08 * 2))),
      },
    });
  });

  it('devuelve la URI original si la imagen es demasiado pequeña', async () => {
    mockManipulate.mockResolvedValueOnce({ uri: 'file://small', width: 50, height: 50 });
    const result = await cropImage('file://tiny.jpg');
    expect(result).toBe('file://tiny.jpg');
    expect(mockManipulate).toHaveBeenCalledTimes(1); // solo metadata
  });

  it('devuelve la URI original si el recorte falla (excepción)', async () => {
    mockManipulate.mockRejectedValue(new Error('manipulate failed'));
    const result = await cropImage('file://fail.jpg');
    expect(result).toBe('file://fail.jpg');
  });
});