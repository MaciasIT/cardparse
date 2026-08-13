import Share from 'react-native-share';
import * as Contacts from 'expo-contacts';
import type { Contact as AppContact } from '../../types/contact';
import { downloadVCard } from './vcard';

export async function shareContactVCard(contact: AppContact) {
  const vcard = downloadVCard(contact);
  const filename = `${contact.name.replace(/[^a-zA-Z0-9]+/g, '_')}.vcf`;

  await Share.open({
    title: 'Compartir contacto',
    message: vcard,
    subject: contact.name,
    url: `data:text/vcard;charset=utf-8;base64,${Buffer.from(vcard, 'utf-8').toString('base64')}`,
    type: 'text/vcard',
    saveToFiles: true,
    filename,
  });
}

export async function saveContactToDevice(contact: AppContact): Promise<void> {
  const permission = await Contacts.requestPermissionsAsync();
  if (permission.status !== Contacts.PermissionStatus.GRANTED) {
    throw new Error('PERMISSION_DENIED');
  }

  const nameParts = contact.name.trim().split(/\s+/);
  const contactRecord = {
    first: nameParts[0] ?? '',
    last: nameParts.slice(1).join(' '),
    organization: contact.company,
    note: contact.note,
    emails: contact.email ? [{ email: contact.email, label: 'Trabajo' }] : undefined,
    phones: contact.phone ? [{ number: contact.phone, label: 'Trabajo' }] : undefined,
    urls: contact.website ? [{ url: contact.website, label: 'Web' }] : undefined,
  } as unknown as Contacts.Contact;

  const contactId = await Contacts.addContactAsync(contactRecord);
  if (!contactId) {
    throw new Error('UNKNOWN_ERROR');
  }
}
