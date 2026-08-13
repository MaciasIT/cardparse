import { useEffect, useMemo, useState } from 'react';
import { Contact } from '../../types/contact';
import { deserializeContacts, saveContacts, STORAGE_KEYS } from '../../lib/storage';
import storage from '../../lib/mmkv';

export type FavoriteContact = Contact & { favorite: boolean };

function toFavoriteContact(contact: Contact): FavoriteContact {
  return { ...contact, favorite: Boolean((contact as unknown as Record<string, unknown>).favorite) };
}

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
    const base = normalized
      ? contacts.filter((item) => {
          const haystack = `${item.name} ${item.email ?? ''} ${item.phone ?? ''}`.toLowerCase();
          return haystack.includes(normalized);
        })
      : contacts;

    return base.map(toFavoriteContact);
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

  const toggleFavorite = async (contact: FavoriteContact) => {
    const next = contacts.map((item) => (item.id === contact.id ? { ...item, favorite: !contact.favorite } : item));
    setContacts(next);
    await saveContacts(next);
  };

  return { contacts, ready, query, setQuery, searchContacts, add, remove, toggleFavorite };
}
