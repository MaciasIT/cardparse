import { useEffect, useState } from 'react';
import { Contact } from '../../types/contact';
import { deserializeContacts, saveContacts, STORAGE_KEYS } from '../../lib/storage';
import storage from '../../lib/mmkv';

export function useHistory() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const raw = await storage.getString(STORAGE_KEYS.contacts);
      setContacts(deserializeContacts(raw));
      setReady(true);
    })();
  }, []);

  const add = async (contact: Contact) => {
    const next = [contact, ...contacts].slice(0, 5000);
    setContacts(next);
    await saveContacts(next);
  };

  const remove = async (id: string) => {
    const next = contacts.filter((item) => item.id !== id);
    setContacts(next);
    await saveContacts(next);
  };

  return { contacts, ready, add, remove };
}
