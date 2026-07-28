import { OcrService } from '../ocrService';

const makeConfig = (overrides: Record<string, unknown> = {}) => ({
  id: 'test-provider',
  provider: 'openrouter' as const,
  endpoint: 'https://api.openrouter.ai/v1/chat/completions',
  apiKey: 'test-api-key',
  model: 'google/gemini-2.5-flash',
  enabled: true as const,
  ...overrides,
});

describe('OcrService', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.clearAllTimers();
  });

  it('throws network error when endpoint is unreachable', async () => {
    globalThis.fetch = () => Promise.reject(new Error('fetch-mock: not implemented')) as any;
    const service = new OcrService();
    await expect(
      service.execute(makeConfig({ endpoint: 'https://invalid.local' }), 'dGVzdA==')
    ).rejects.toMatchObject({ kind: 'network' });
  });

  it('throws timeout when initial signal is already aborted', async () => {
    globalThis.fetch = () => Promise.reject(new Error('fetch-mock: not implemented')) as any;
    const service = new OcrService();
    const ac = new AbortController();
    ac.abort();
    await expect(
      service.execute(makeConfig({ endpoint: 'https://invalid.local' }), 'dGVzdA==', ac.signal)
    ).rejects.toMatchObject({ kind: 'timeout' });
  });
});
