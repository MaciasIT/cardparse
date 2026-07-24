import { parseContact } from '../contactParser';

describe('parseContact', () => {
  it('should parse name, email and phone from normalized text', () => {
    const result = parseContact(
      'María García\nAcme SL\nmaria@acme.es\n+34 612 345 678\nhttps://acme.es',
    );

    expect(result.contact.email).toBe('maria@acme.es');
    expect(result.contact.website).toBe('https://acme.es');
    expect(result.contact.source).toBe('both');
    expect(typeof result.contact.id).toBe('string');
    expect(result.contact.id.length).toBeGreaterThan(0);
  });

  it('should normalize spaces and keep minimal fallback name', () => {
    const result = parseContact('Juan   Pérez  \n juan@example.com');

    expect(result.contact.email).toBe('juan@example.com');
  });

  it('should maintain raw text without collapsed spaces', () => {
    const result = parseContact('Laura   López\n laura@test.com');

    expect(result.rawText).toContain('Laura');
  });
});
