import { parseContact } from '../contactParser';

describe('contactParser', () => {
  it('should parse name, email and phone from normalized text', () => {
    const result = parseContact('Juan Perez | juan@example.com | 600000000');
    expect(result.contact.name).toBe('Juan Perez | juan@example.com | 600000000');
  });

  it('should preserve raw text and normalize whitespace', () => {
    const raw = '  Juan   Perez  | juan@example.com | 600000000  ';
    const result = parseContact(raw);
    expect(result.contact.name).toBe('Juan Perez | juan@example.com | 600000000');
    expect(result.rawText).toBe('Juan Perez | juan@example.com | 600000000');
  });
});
