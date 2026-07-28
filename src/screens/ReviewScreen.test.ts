import { ensureContact, sanitizeText } from './ReviewScreen';

describe('ReviewScreen contracts', () => {
  it('sanitizes whitespace from text fields', () => {
    expect(sanitizeText('Ana   López ')).toBe('Ana López');
  });

  it('ensures a valid id when contact id is missing', () => {
    const contact = { id: '', name: 'X', source: 'both' as const, createdAt: 1, updatedAt: 1 };
    const ensured = ensureContact(contact);
    expect(ensured.id).toMatch(/^contact_/);
  });

  it('keeps existing valid id', () => {
    const contact = { id: 'contact_123', name: 'X', source: 'both' as const, createdAt: 1, updatedAt: 1 };
    const ensured = ensureContact(contact);
    expect(ensured.id).toBe('contact_123');
  });
});
