import { useState, useEffect } from 'react';
import * as Contacts from 'expo-contacts';
import * as ImagePicker from 'expo-image-picker';

export type PermissionState = 'idle' | 'loading' | 'granted' | 'denied';

export function usePermissions() {
  const [camera, setCamera] = useState<PermissionState>('idle');
  const [contacts, setContacts] = useState<PermissionState>('idle');

  useEffect(() => {
    (async () => {
      setCamera('loading');
      setContacts('loading');

      const cameraStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const contactsStatus = await Contacts.requestPermissionsAsync();

      setCamera(cameraStatus.granted ? 'granted' : 'denied');
      setContacts(contactsStatus.status === Contacts.PermissionStatus.GRANTED ? 'granted' : 'denied');
    })();
  }, []);

  const rerollCamera = async () => setCamera('loading');
  const rerollContacts = async () => setContacts('loading');

  return { camera, contacts, rerollCamera, rerollContacts };
}
