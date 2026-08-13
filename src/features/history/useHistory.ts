import { useEffect, useMemo, useState } from 'react';
import { Contact } from '../../types/contact';
import { deserializeContacts, saveContacts, STORAGE_KEYS } from '../../lib/storage';
import storage from '../../lib/mmkv';

export function useHistory() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    (async () => {
      const raw = await storage.getString(STORAGE_KEYS.contacts);
      setContacts(deserializeContacts(raw));
      setReady(true);
    })();
  }, []);

  const searchContacts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return contacts;
    return contacts.filter((item) => {
      const haystack = `${item.name} ${item.email ?? ''} ${item.phone ?? ''}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [contacts, query]);

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

  return { contacts, ready, query, setQuery, searchContacts, add, remove };
}
