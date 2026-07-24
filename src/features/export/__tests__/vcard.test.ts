import { buildVCard } from '../vcard';

describe('export vCard', () => {
  it('builds a minimal vCard with name', () => {
    const contact = {
      id: '1',
      name: 'Juan Perez',
      company: 'ACME',
      email: 'juan@example.com',
      phone: '600000000',
      website: 'https://example.com',
      note: 'nota',
      source: 'front',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const vcard = buildVCard(contact);
    expect(vcard).toContain('BEGIN:VCARD');
    expect(vcard).toContain('FN:Juan Perez');
    expect(vcard).toContain('ORG:ACME');
    expect(vcard).toContain('EMAIL:juan@example.com');
    expect(vcard).toContain('END:VCARD');
  });

  it('does not include empty optional fields', () => {
    const vcard = buildVCard({
      id: '2',
      name: 'Solo Nombre',
      source: 'back',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    expect(vcard).not.toContain('ORG:');
    expect(vcard).not.toContain('EMAIL:');
    expect(vcard).not.toContain('TEL:');
  });
});
