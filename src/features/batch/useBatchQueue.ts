import { useState, useEffect, useMemo } from 'react';
import storage from '../../lib/mmkv';
import { STORAGE_KEYS } from '../../lib/storage';

export type BatchStatus = 'idle' | 'capturing' | 'processing' | 'review' | 'saving' | 'done' | 'error';

export type BatchItem = {
  id: string;
  uri: string;
  rawText: string;
  status: BatchStatus;
  attempts: number;
  error?: string;
};

const MAX_ITEMS = 20;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

export function useBatchQueue() {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await storage.getString(STORAGE_KEYS.batchQueue);
        if (raw) {
          const parsed = JSON.parse(raw) as BatchItem[];
          if (Array.isArray(parsed)) setItems(parsed);
        }
      } catch {
        setItems([]);
      }
    })();
  }, []);

  const persist = async (next: BatchItem[]) => {
    setItems(next);
    await storage.setString(STORAGE_KEYS.batchQueue, JSON.stringify(next));
  };

  const enqueue = async (item: Omit<BatchItem, 'id' | 'status' | 'attempts'>) => {
    const next: BatchItem[] = [
      ...items,
      {
        ...item,
        id: `batch_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        status: 'capturing',
        attempts: 0,
      },
    ];
    await persist(next.slice(-MAX_ITEMS));
  };

  const updateItem = async (id: string, patch: Partial<BatchItem>) => {
    const next = items.map((item) => (item.id === id ? { ...item, ...patch } : item));
    await persist(next);
  };

  const retryItem = async (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    await updateItem(id, { status: 'processing', attempts: item.attempts + 1, error: undefined });
  };

  const retryNext = async () => {
    const nextError = items.find((entry) => entry.status === 'error' && entry.attempts < MAX_RETRIES);
    if (!nextError) return;
    await retryItem(nextError.id);
  };

  const removeItem = async (id: string) => {
    const next = items.filter((entry) => entry.id !== id);
    await persist(next);
  };

  const clear = async () => {
    await persist([]);
  };

  const summary = useMemo(() => {
    const total = items.length;
    const pending = items.filter((entry) => entry.status === 'capturing' || entry.status === 'processing').length;
    const failed = items.filter((entry) => entry.status === 'error').length;
    return { total, pending, failed };
  }, [items]);

  const runAll = async () => {
    setLoading(true);
    await retryNext();
    setLoading(false);
  };

  return { items, loading, enqueue, updateItem, retryItem, retryNext, removeItem, clear, runAll, summary };
}
