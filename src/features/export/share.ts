import Share from 'react-native-share';
import { Contact } from '../../types/contact';
import { downloadVCard } from './vcard';

export async function shareContactVCard(contact: Contact) {
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
