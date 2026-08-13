import { Contact } from '../../types/contact';

export function buildVCard(contact: Contact): string {
  const photo = contact.logoUri ? `PHOTO;VALUE=uri:${escape(contact.logoUri)}` : null;
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escape(contact.name)}`,
    contact.company ? `ORG:${escape(contact.company)}` : null,
    contact.email ? `EMAIL:${escape(contact.email)}` : null,
    contact.phone ? `TEL:${escape(contact.phone)}` : null,
    contact.website ? `URL:${escape(contact.website)}` : null,
    contact.note ? `NOTE:${escape(contact.note)}` : null,
    photo,
    'END:VCARD',
  ]
    .filter(Boolean)
    .join('\n');

  return lines;
}

export function downloadVCard(contact: Contact): string {
  return buildVCard(contact);
}

function escape(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}
