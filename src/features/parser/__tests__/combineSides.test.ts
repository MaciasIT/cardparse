import { combineSides } from '../combineSides';

describe('combineSides — T17 doble cara', () => {
  it('combina dos textos con contenido distinto manteniendo el orden', () => {
    const result = combineSides('Ana López\nDirectora comercial', 'ana@empresa.es\n+34 600 123 456');
    expect(result).toBe('Ana López Directora comercial\nana@empresa.es +34 600 123 456');
  });

  it('devuelve solo la cara A si la cara B está vacía', () => {
    expect(combineSides('Ana López', '')).toBe('Ana López');
    expect(combineSides('Ana López', '   ')).toBe('Ana López');
  });

  it('devuelve solo la cara B si la cara A está vacía', () => {
    expect(combineSides(null, 'ana@empresa.es')).toBe('ana@empresa.es');
    expect(combineSides(undefined, 'ana@empresa.es')).toBe('ana@empresa.es');
  });

  it('normaliza espacios múltiples y saltos redundantes', () => {
    const result = combineSides('Ana   López\n\n\nDirectora', 'ana@empresa.es  \n\n+34 600 123 456');
    expect(result).toBe('Ana López Directora\nana@empresa.es +34 600 123 456');
  });

  it('devuelve string vacío si ambas caras están vacías', () => {
    expect(combineSides('', null)).toBe('');
    expect(combineSides(undefined, undefined)).toBe('');
  });

  it('el texto combinado preserva email y teléfono detectables por el parser', () => {
    const combined = combineSides('Ana López Directora', 'ana@empresa.es +34 600 123 456');
    expect(combined).toContain('ana@empresa.es');
    expect(combined).toContain('+34 600 123 456');
  });
});
