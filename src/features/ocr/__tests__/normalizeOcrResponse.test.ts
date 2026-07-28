import { normalizeOcrResponse } from '../normalizeOcrResponse';

describe('normalizeOcrResponse', () => {
  it('passes through direct rawText shape', () => {
    const result = normalizeOcrResponse({ rawText: 'Hola mundo', processingMs: 120 });
    expect(result.rawText).toBe('Hola mundo');
    expect(result.processingMs).toBe(120);
  });

  it('extracts rawText from OpenAI-compatible choices wrapper', () => {
    const result = normalizeOcrResponse({ choices: [{ message: { content: 'Texto extraído' } }] });
    expect(result.rawText).toBe('Texto extraído');
  });

  it('extracts rawText from Google Gemini candidates shape', () => {
    const result = normalizeOcrResponse({
      candidates: [{ content: { parts: [{ text: 'Texto Gemini' }] } }],
    });
    expect(result.rawText).toBe('Texto Gemini');
  });

  it('extracts rawText from OpenRouter shape (data.choices)', () => {
    const result = normalizeOcrResponse({
      data: { choices: [{ message: { content: 'Texto OpenRouter' } }] },
    });
    expect(result.rawText).toBe('Texto OpenRouter');
  });

  it('throws unknown_wrapper for null response', () => {
    expect(() => normalizeOcrResponse(null)).toThrow();
  });

  it('throws unknown_wrapper for non-object response', () => {
    expect(() => normalizeOcrResponse('plain')).toThrow();
  });

  it('throws unknown_wrapper when no known wrapper matches', () => {
    expect(() => normalizeOcrResponse({ unexpected: true })).toThrow();
  });

  it('returns undefined processingMs when not provided in direct shape', () => {
    const result = normalizeOcrResponse({ rawText: 'sin tiempo' });
    expect(result.rawText).toBe('sin tiempo');
    expect(result.processingMs).toBeUndefined();
  });
});
