import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { ScannerScreen } from './ScannerScreen';

jest.mock('expo-camera', () => {
  const ReactMock = require('react');
  const { View } = require('react-native');
  return {
    useCameraPermissions: jest.fn(() => [{ granted: true, status: 'granted' }, jest.fn()]),
    CameraView: ReactMock.forwardRef((props: Record<string, unknown>, ref: React.Ref<unknown>) => {
      ReactMock.useImperativeHandle(ref, () => ({ takePictureAsync: jest.fn(async () => ({ uri: 'file:///mock-photo.jpg' })) }));
      return ReactMock.createElement(View, { ...props, testID: 'camera-view' });
    }),
  };
});

jest.mock('../lib/storage', () => ({
  loadProviderConfig: jest.fn().mockResolvedValue({ id: 'test', provider: 'custom', endpoint: 'https://api.test/v1', apiKey: 'test-key', model: 'mock-model', enabled: true }),
  saveProviderConfig: jest.fn(),
  loadActiveScanId: jest.fn().mockResolvedValue(null),
  saveActiveScanId: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../lib/mmkv', () => ({
  storage: {
    getString: jest.fn().mockResolvedValue(null),
    setString: jest.fn().mockResolvedValue(undefined),
    getBoolean: jest.fn().mockResolvedValue(null),
    setBoolean: jest.fn().mockResolvedValue(undefined),
    getObject: jest.fn().mockResolvedValue(null),
    setObject: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../features/ocr/ocrService', () => ({ OcrService: jest.fn().mockImplementation(() => ({ execute: jest.fn(async () => ({ rawText: 'texto-ocr', processingMs: 42 })), cancel: jest.fn() })) }));
jest.mock('../features/export/share', () => ({ shareContactVCard: jest.fn().mockResolvedValue(undefined) }));
jest.mock('../features/camera/cropToContent', () => ({ cropImage: jest.fn(async (uri: string) => uri) }));
jest.mock('react-native-share', () => ({ __esModule: true, default: { open: jest.fn() } }));
jest.mock('../features/parser/contactParser', () => ({ parseContact: jest.fn(() => ({ contact: { id: '1', name: 'Test Contact', source: 'both', createdAt: Date.now(), updatedAt: Date.now() } })) }));
jest.mock('../features/parser/combineSides', () => ({ combineSides: jest.fn(() => 'combined text') }));

type Instance = TestRenderer.ReactTestInstance;

function allTexts(renderer: TestRenderer.ReactTestRenderer): string[] {
  const out: string[] = [];
  const visit = (node: Instance) => {
    if (String(node.type) === 'Text' && Array.isArray(node.children)) {
      const plain = node.children.filter((c) => typeof c === 'string').join('');
      if (plain) out.push(plain);
    }
    node.children?.forEach((c) => { if (typeof c !== 'string') visit(c); });
  };
  visit(renderer.root);
  return out;
}

function hasText(renderer: TestRenderer.ReactTestRenderer, text: string): boolean {
  return allTexts(renderer).some((t) => t.includes(text));
}

function clickableWithText(renderer: TestRenderer.ReactTestRenderer, text: string): Instance | undefined {
  return renderer.root.findAll((n) => n.props && typeof n.props.onPress === 'function').find((p) => {
    const out: string[] = [];
    const visit = (node: Instance) => {
      if (String(node.type) === 'Text' && Array.isArray(node.children)) {
        const plain = node.children.filter((c) => typeof c === 'string').join('');
        if (plain) out.push(plain);
      }
      node.children?.forEach((c) => { if (typeof c !== 'string') visit(c); });
    };
    visit(p);
    return out.some((t) => t.includes(text));
  });
}

async function flush() {
  await act(async () => { await Promise.resolve(); await Promise.resolve(); });
}
async function flushLong() {
  await act(async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); });
}

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn().mockResolvedValue({ arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer }) as unknown as typeof fetch;
});

describe('ScannerScreen — doble cara (T17)', () => {
  it('tras capturar la cara A ofrece capturar la cara B en lugar de abrir el Review', async () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    await act(async () => { renderer = TestRenderer.create(<ScannerScreen />); });
    await flush();

    expect(hasText(renderer, 'Capturar y procesar')).toBe(true);

    const capture = clickableWithText(renderer, 'Capturar y procesar');
    await act(async () => { await capture!.props.onPress(); });
    await flushLong();

    expect(hasText(renderer, 'Capturar cara B')).toBe(true);
    expect(hasText(renderer, 'Revisar contacto')).toBe(false);
  });

  it('diagnóstico: tras capturar ambas caras NO abre el Review en test', async () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    await act(async () => { renderer = TestRenderer.create(<ScannerScreen />); });
    await flush();

    const captureA = clickableWithText(renderer, 'Capturar y procesar');
    await act(async () => { await captureA!.props.onPress(); });
    await flushLong();

    const captureB = clickableWithText(renderer, 'Capturar cara B');
    await act(async () => { await captureB!.props.onPress(); });
    await flushLong();
    await flushLong();
    await flushLong();

    const texts = allTexts(renderer);
    console.log('TEXTOS DESPUÉS DE AMBAS CARAS:', texts);
    console.log('HA REVISAR CONTACTO:', hasText(renderer, 'Revisar contacto'));

    expect(hasText(renderer, 'Revisar contacto')).toBe(true);
  });

  it('cancelar tras la cara A vuelve al estado inicial sin abrir el Review', async () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    await act(async () => { renderer = TestRenderer.create(<ScannerScreen />); });
    await flush();

    const captureA = clickableWithText(renderer, 'Capturar y procesar');
    await act(async () => { await captureA!.props.onPress(); });
    await flushLong();

    const cancel = clickableWithText(renderer, 'Cancelar');
    await act(async () => { await cancel!.props.onPress(); });
    await flush();

    expect(hasText(renderer, 'Capturar y procesar')).toBe(true);
    expect(hasText(renderer, 'Revisar contacto')).toBe(false);
  });
});
