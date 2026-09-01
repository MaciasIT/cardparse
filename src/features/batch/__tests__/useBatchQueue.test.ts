import { useBatchQueue } from '../useBatchQueue';
import storage from '../../lib/mmkv';
import { STORAGE_KEYS } from '../../lib/storage';

const mockedStorage = storage as jest.Mocked<typeof storage>;

const baseItem = (overrides = {}) => ({
  id: 'batch_1',
  uri: 'file:///a.jpg',
  rawText: 'texto',
  status: 'capturing',
  attempts: 0,
  nextRetryAt: undefined,
  lastError: null,
  contact: undefined,
  error: undefined,
  ...overrides,
});

beforeEach(() => {
  mockedStorage.getString.mockClear();
  mockedStorage.setString.mockClear();
  mockedStorage.getString.mockResolvedValue(null);
});

describe('useBatchQueue', () => {
  it('arranca vacío si no hay storage', async () => {
    const itemsRef: { current: ReturnType<typeof useBatchQueue>['items'] } = { current: [] };
    const summaryRef: { current: ReturnType<typeof useBatchQueue>['summary'] } = { current: { total: 0, pending: 0, failed: 0, done: 0, processing: 0 } };

    const hook = useBatchQueue();
    itemsRef.current = hook.items;
    summaryRef.current = hook.summary;

    expect(itemsRef.current).toEqual([]);
    expect(summaryRef.current).toEqual({ total: 0, pending: 0, failed: 0, done: 0, processing: 0 });
  });
});
