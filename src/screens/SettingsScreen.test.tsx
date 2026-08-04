import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { SettingsScreen } from './SettingsScreen';
import * as storage from '../lib/storage';
import { ProviderConfig } from '../types/contact';

jest.mock('../lib/storage', () => ({
  loadProviderConfig: jest.fn(),
  saveProviderConfig: jest.fn(),
}));

const mockLoad = storage.loadProviderConfig as jest.Mock;
const mockSave = storage.saveProviderConfig as jest.Mock;

const SAMPLE_CONFIG: ProviderConfig = {
  id: 'custom-provider',
  provider: 'custom',
  endpoint: 'https://api.openrouter.ai/api/v1',
  model: 'google/gemini-2.0-flash-001',
  apiKey: 'sk-abc123secretTAIL',
  enabled: true,
  updatedAt: 1750000000000,
};

type Instance = TestRenderer.ReactTestInstance;

function renderSettings() {
  let renderer!: TestRenderer.ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(<SettingsScreen />);
  });
  return renderer;
}

async function flush() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

function textsOf(instance: Instance): string[] {
  const out: string[] = [];
  const visit = (node: Instance) => {
    if (String(node.type) === 'Text' && Array.isArray(node.children)) {
      const plain = node.children.filter((c) => typeof c === 'string').join('');
      if (plain) out.push(plain);
    }
    node.children?.forEach((c) => {
      if (typeof c !== 'string') visit(c);
    });
  };
  visit(instance);
  return out;
}

function allTexts(renderer: TestRenderer.ReactTestRenderer): string[] {
  return textsOf(renderer.root);
}

function hasText(renderer: TestRenderer.ReactTestRenderer, text: string): boolean {
  return allTexts(renderer).some((t) => t.includes(text));
}

function clickableWithText(renderer: TestRenderer.ReactTestRenderer, text: string): Instance | undefined {
  return renderer.root
    .findAll((n) => n.props && typeof n.props.onPress === 'function')
    .find((p) => textsOf(p).some((t) => t.includes(text)));
}

function inputByPlaceholder(renderer: TestRenderer.ReactTestRenderer, placeholder: string): Instance {
  const match = renderer.root.findAll(
    (n) => n.props && typeof n.props.onChangeText === 'function' && n.props.placeholder === placeholder,
  );
  if (match.length === 0) {
    throw new Error(`No TextInput with placeholder "${placeholder}"`);
  }
  return match[match.length - 1];
}

beforeEach(() => {
  jest.clearAllMocks();
  mockLoad.mockResolvedValue(null);
  mockSave.mockResolvedValue(undefined);
});

describe('SettingsScreen — configuración OCR (T16)', () => {
  it('muestra la configuración almacenada con API key enmascarada y última guardada', async () => {
    mockLoad.mockResolvedValue(SAMPLE_CONFIG);
    const renderer = renderSettings();
    await flush();

    expect(hasText(renderer, 'https://api.openrouter.ai/api/v1')).toBe(true);
    expect(hasText(renderer, 'google/gemini-2.0-flash-001')).toBe(true);
    expect(hasText(renderer, 'TAIL')).toBe(true);
    expect(hasText(renderer, 'Activo')).toBe(true);
    expect(hasText(renderer, 'Última guardada')).toBe(true);
    // La key completa NO debe aparecer en claro
    expect(hasText(renderer, 'sk-abc123secretTAIL')).toBe(false);
  });

  it('indica proveedor no configurado cuando falta configuración', async () => {
    mockLoad.mockResolvedValue(null);
    const renderer = renderSettings();
    await flush();

    expect(hasText(renderer, 'Proveedor no configurado')).toBe(true);
  });

  it('persiste cambios válidos al guardar', async () => {
    mockLoad.mockResolvedValue(null);
    const renderer = renderSettings();
    await flush();

    const configure = clickableWithText(renderer, 'Configurar');
    expect(configure).toBeDefined();
    act(() => configure!.props.onPress());

    act(() =>
      inputByPlaceholder(renderer, 'https://api.openrouter.ai/api/v1').props.onChangeText(
        'https://api.openrouter.ai/api/v1',
      ),
    );
    act(() =>
      inputByPlaceholder(renderer, 'google/gemini-2.0-flash-001').props.onChangeText(
        'google/gemini-2.0-flash-001',
      ),
    );
    act(() => inputByPlaceholder(renderer, 'sk-…').props.onChangeText('sk-nueva-clave-1234'));

    const saveButton = clickableWithText(renderer, 'Guardar');
    expect(saveButton).toBeDefined();
    await act(async () => {
      saveButton!.props.onPress();
    });

    expect(mockSave).toHaveBeenCalledTimes(1);
    const saved = mockSave.mock.calls[0][0] as ProviderConfig;
    expect(saved.endpoint).toBe('https://api.openrouter.ai/api/v1');
    expect(saved.model).toBe('google/gemini-2.0-flash-001');
    expect(saved.apiKey).toBe('sk-nueva-clave-1234');
    expect(saved.enabled).toBe(true);
    expect(saved.updatedAt).toEqual(expect.any(Number));
  });

  it('bloquea el guardado si falta un campo obligatorio', async () => {
    mockLoad.mockResolvedValue(null);
    const renderer = renderSettings();
    await flush();

    const configure = clickableWithText(renderer, 'Configurar');
    act(() => configure!.props.onPress());

    act(() =>
      inputByPlaceholder(renderer, 'https://api.openrouter.ai/api/v1').props.onChangeText(
        'https://api.openrouter.ai/api/v1',
      ),
    );
    // model y apiKey quedan vacíos

    const saveButton = clickableWithText(renderer, 'Guardar');
    await act(async () => {
      saveButton!.props.onPress();
    });

    expect(mockSave).not.toHaveBeenCalled();
    expect(hasText(renderer, 'Endpoint, modelo y API key son obligatorios.')).toBe(true);
  });

  it('desactiva el proveedor desde Ajustes sin eliminar la config', async () => {
    mockLoad.mockResolvedValue(SAMPLE_CONFIG);
    const renderer = renderSettings();
    await flush();

    const switches = renderer.root.findAll(
      (n) => n.props && typeof n.props.onValueChange === 'function' && 'value' in n.props,
    );
    expect(switches.length).toBeGreaterThan(0);
    await act(async () => {
      switches[0].props.onValueChange(false);
    });

    expect(mockSave).toHaveBeenCalledTimes(1);
    const saved = mockSave.mock.calls[0][0] as ProviderConfig;
    expect(saved.enabled).toBe(false);
    expect(saved.endpoint).toBe(SAMPLE_CONFIG.endpoint);
    expect(saved.model).toBe(SAMPLE_CONFIG.model);
    expect(hasText(renderer, 'Desactivado')).toBe(true);
  });

  it('la fila de onboarding reinicia cuando hay callback', async () => {
    mockLoad.mockResolvedValue(null);
    const onRestart = jest.fn();
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(<SettingsScreen onRestartOnboarding={onRestart} />);
    });
    await flush();

    const restartRow = renderer.root
      .findAll((n) => n.props && typeof n.props.onPress === 'function')
      .find((p) => {
        const out: string[] = [];
        const visit = (node: Instance) => {
          if (String(node.type) === 'Text' && Array.isArray(node.children)) {
            const plain = node.children.filter((c) => typeof c === 'string').join('');
            if (plain) out.push(plain);
          }
          node.children?.forEach((c) => {
            if (typeof c !== 'string') visit(c);
          });
        };
        visit(p);
        return out.some((t) => t.includes('Onboarding'));
      });

    expect(restartRow).toBeDefined();
    act(() => {
      restartRow!.props.onPress();
    });
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it('la fila de onboarding no rompe sin callback', async () => {
    mockLoad.mockResolvedValue(null);
    const renderer = renderSettings(); // sin onRestartOnboarding
    await flush();

    // El render no rompe y la fila sigue presente
    expect(hasText(renderer, 'Onboarding')).toBe(true);
    expect(hasText(renderer, 'Reiniciar')).toBe(true);
  });
});
