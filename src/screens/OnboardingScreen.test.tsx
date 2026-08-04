import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { OnboardingScreen } from './OnboardingScreen';
import * as mmkv from '../lib/mmkv';
import { STORAGE_KEYS } from '../lib/storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

jest.mock('../lib/mmkv', () => {
  const store = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getBoolean: jest.fn(async (key: string) => {
        const v = store.get(key);
        return v === 'true' ? true : v === 'false' ? false : null;
      }),
      setBoolean: jest.fn(async (key: string, value: boolean) => {
        store.set(key, String(value));
      }),
      remove: jest.fn(async (key: string) => {
        store.delete(key);
      }),
      getString: jest.fn(),
      setString: jest.fn(),
      getObject: jest.fn(),
      setObject: jest.fn(),
    },
  };
});

const storage = mmkv.default;

type Instance = TestRenderer.ReactTestInstance;

function clickableWithText(renderer: TestRenderer.ReactTestRenderer, text: string): Instance | undefined {
  const texts = (n: Instance): string[] => {
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
    visit(n);
    return out;
  };
  return renderer.root
    .findAll((n) => n.props && typeof n.props.onPress === 'function')
    .find((p) => texts(p).some((t) => t.includes(text)));
}

function renderOnboarding(onFinish: () => void) {
  let renderer!: TestRenderer.ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(<OnboardingScreen onFinish={onFinish} />);
  });
  return renderer;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('OnboardingScreen — completo (T20)', () => {
  it('recorre los tres pasos y llama a onFinish al terminar', async () => {
    const onFinish = jest.fn();
    const renderer = renderOnboarding(onFinish);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    const step1 = clickableWithText(renderer, 'Siguiente');
    expect(step1).toBeDefined();

    // Paso 1 → 2
    act(() => step1!.props.onPress());
    const step2 = clickableWithText(renderer, 'Siguiente');
    expect(step2).toBeDefined();

    // Paso 2 → 3 (doble cara)
    act(() => step2!.props.onPress());
    const step3 = clickableWithText(renderer, 'Empezar');
    expect(step3).toBeDefined();

    // Paso 3 → terminar
    await act(async () => {
      step3!.props.onPress();
      await Promise.resolve();
    });

    expect(storage.setBoolean).toHaveBeenCalledWith(STORAGE_KEYS.onboarding, true);
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('muestra el texto del tutorial de doble cara en el tercer paso', async () => {
    const renderer = renderOnboarding(jest.fn());
    await act(async () => {
      await Promise.resolve();
    });

    act(() => clickableWithText(renderer, 'Siguiente')!.props.onPress());
    act(() => clickableWithText(renderer, 'Siguiente')!.props.onPress());

    const allTexts = renderer.root
      .findAll((n) => String(n.type) === 'Text')
      .map((t) => t.children?.filter((c) => typeof c === 'string').join('') ?? '')
      .join(' | ');

    expect(allTexts).toContain('Doble cara');
    expect(allTexts).toContain('une ambas caras en un solo contacto');
  });

  it('llama a onFinish inmediatamente si el onboarding ya se completó', async () => {
    (storage.getBoolean as jest.Mock).mockImplementation(async () => true);
    const onFinish = jest.fn();
    renderOnboarding(onFinish);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});
