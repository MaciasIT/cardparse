/**
 * CardParse — Parser de texto OCR a Contact normalizado.
 *
 * Entrada: texto plano de una tarjeta escaneada.
 * Salida: contacto con campos detectados y normalizados.
 */

import { Contact } from '../../types/contact';

interface ParsedResult {
  contact: Contact;
  rawText: string;
}

function generateId(): string {
  return `contact_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function extractEmail(text: string): string | undefined {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0].trim() : undefined;
}

function extractPhone(text: string): string | undefined {
  const normalized = text.replace(/[^0-9+()\-.\s]/g, '');
  const match = normalized.match(/\+?\d{7,15}/);
  if (!match) return undefined;

  let phone = match[0].replace(/[()\-.\s]/g, '');

  if (!phone.startsWith('+')) {
    const digits = phone.replace(/\D/g, '');
    phone = digits.length <= 9 ? `+34${digits}` : `+${digits}`;
  }

  return phone;
}

function extractWebsite(text: string): string | undefined {
  const httpMatch = text.match(/(https?:\/\/[^\s]+)/i);
  if (httpMatch) {
    return httpMatch[0].trim();
  }

  const plainMatch = text.match(/([a-z0-9.-]+\.[a-z]{2,})(\/\S*)?/i);
  if (!plainMatch) return undefined;

  const website = plainMatch[0].trim();
  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}

function extractFields(fullText: string, email: string | undefined, phone: string | undefined, website: string | undefined) {
  const lines = fullText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const name = lines[0] ?? 'Contacto';
  const company = lines[1];

  return {
    name,
    company: company !== name ? company : undefined,
    email,
    phone,
    website,
  };
}

function normalizeRawText(rawText: string): string {
  return rawText.replace(/\s+/g, ' ').trim();
}

export function parseContact(rawText: string): ParsedResult {
  const text = normalizeRawText(rawText);
  const email = extractEmail(text);
  const phone = extractPhone(text);
  const website = extractWebsite(text);
  const { name, company } = extractFields(text, email, phone, website);

  return {
    rawText: text,
    contact: {
      id: generateId(),
      name,
      company,
      email,
      phone,
      website,
      note: text,
      logoUri: undefined,
      source: 'both',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  };
}
