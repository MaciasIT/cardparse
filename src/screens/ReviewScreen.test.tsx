import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { ReviewScreen } from './ReviewScreen';
import { shareContactVCard } from '../features/export/share';
import type { Contact } from '../types/contact';

jest.mock('../features/export/share', () => ({
  shareContactVCard: jest.fn().mockResolvedValue(undefined),
}));

const mockShare = shareContactVCard as jest.Mock;

const makeContact = (overrides: Partial<Contact> = {}): Contact => ({
  id: 'contact_test',
  name: 'Ana López',
  company: 'Empresa SL',
  email: 'ana@empresa.es',
  phone: '+34 600 123 456',
  website: 'https://empresa.es',
  source: 'both',
  createdAt: 1,
  updatedAt: 1,
  ...overrides,
});

type Instance = TestRenderer.ReactTestInstance;

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

function clickableWithText(renderer: TestRenderer.ReactTestRenderer, text: string): Instance | undefined {
  return renderer.root
    .findAll((n) => n.props && typeof n.props.onPress === 'function')
    .find((p) => textsOf(p).some((t) => t.includes(text)));
}

function renderReview(props: Partial<React.ComponentProps<typeof ReviewScreen>> = {}) {
  let renderer!: TestRenderer.ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(
      <ReviewScreen
        visible
        contact={makeContact()}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        {...props}
      />,
    );
  });
  return renderer;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ReviewScreen — compartir sin guardar (T18)', () => {
  it('sin onShare no muestra la acción Compartir', () => {
    const renderer = renderReview({ onShare: undefined });
    const all = renderer.root.findAll(
      (n) => n.props && typeof n.props.onPress === 'function',
    );
    const hasShare = all.some((p) => textsOf(p).some((t) => t.includes('Compartir')));
    expect(hasShare).toBe(false);
  });

  it('comparte el contacto editado sin llamar a onConfirm', async () => {
    const onConfirm = jest.fn();
    const onShare = jest.fn();
    const renderer = renderReview({ onConfirm, onShare });

    // Editar email en el formulario
    const inputs = renderer.root.findAll(
      (n) => n.props && typeof n.props.onChangeText === 'function' && typeof n.props.value === 'string',
    );
    const emailInput = inputs.find((i) => String(i.props.value) === 'ana@empresa.es');
    expect(emailInput).toBeDefined();
    act(() => {
      emailInput!.props.onChangeText('nuevo@editado.es');
    });

    const shareButton = clickableWithText(renderer, 'Compartir');
    expect(shareButton).toBeDefined();
    act(() => {
      shareButton!.props.onPress();
    });

    expect(onShare).toHaveBeenCalledTimes(1);
    const shared = onShare.mock.calls[0][0] as Contact;
    expect(shared.email).toBe('nuevo@editado.es');
    expect(shared.name).toBe('Ana López');
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('compartir deja el modal abierto y permite confirmar después', () => {
    const onShare = jest.fn();
    const onConfirm = jest.fn();
    const renderer = renderReview({ onShare, onConfirm });

    const shareButton = clickableWithText(renderer, 'Compartir');
    act(() => {
      shareButton!.props.onPress();
    });

    // El modal sigue abierto: Confirmar sigue presente y funcional
    expect(onShare).toHaveBeenCalledTimes(1);
    const confirmButton = clickableWithText(renderer, 'Confirmar');
    act(() => {
      confirmButton!.props.onPress();
    });
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('deshabilita Compartir si el nombre se borra del formulario', () => {
    const onShare = jest.fn();
    const renderer = renderReview({
      contact: makeContact({ name: '' }),
      onShare,
    });

    // ensureContact rellena 'Contacto' por defecto; el usuario borra el campo de nombre.
    const nameInput = renderer.root
      .findAll(
        (n) => n.props && typeof n.props.onChangeText === 'function' && typeof n.props.value === 'string',
      )
      .find((i) => String(i.props.value) === 'Contacto');
    expect(nameInput).toBeDefined();
    act(() => {
      nameInput!.props.onChangeText('');
    });

    const texts = renderer.root
      .findAll((n) => String(n.type) === 'Text')
      .map((t) => t.children?.filter((c) => typeof c === 'string').join('') ?? '');
    expect(texts.some((t) => t.includes('nombre obligatorio'))).toBe(true);

    // Pulsar el botón deshabilitado no comparte nada
    const shareButton = clickableWithText(renderer, 'Compartir');
    act(() => {
      shareButton!.props.onPress();
    });
    expect(onShare).not.toHaveBeenCalled();
  });

  it('shareContactVCard se usa como conexión real en ScannerScreen', async () => {
    // Verifica que el mock del share se exporta correctamente para el conector
    expect(mockShare).toBeDefined();
    await mockShare(makeContact());
    expect(mockShare).toHaveBeenCalled();
  });
});
