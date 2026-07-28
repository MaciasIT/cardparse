import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Button, palette, spacing } from '../components';
import type { Contact } from '../types/contact';

export type ReviewScreenProps = {
  contact: Contact;
  visible: boolean;
  onConfirm: (contact: Contact) => void;
  onCancel: () => void;
};

export function sanitizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function ensureContact(contact: Contact): Contact {
  return {
    ...contact,
    id: contact.id && typeof contact.id === 'string' && contact.id.trim().length > 0 ? contact.id : `contact_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: sanitizeText(contact.name || 'Contacto'),
  };
}

export function ReviewScreen({ contact, visible, onConfirm, onCancel }: ReviewScreenProps) {
  const [form, setForm] = useState<Contact>(ensureContact(contact));

  if (!visible) return null;

  function update<K extends keyof Contact>(key: K, value: Contact[K]) {
    setForm((prev) => ({ ...prev, [key]: sanitizeText(value as string) }));
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <View style={styles.root}>
        <Text style={styles.title}>Revisar contacto</Text>

        <Field label="Nombre" value={form.name} onChangeText={(text) => update('name', text)} />
        <Field label="Empresa" value={form.company} onChangeText={(text) => update('company', text)} autoCapitalize="words" />
        <Field label="Teléfono" value={form.phone} onChangeText={(text) => update('phone', text)} keyboardType="phone-pad" />
        <Field label="Email" value={form.email} onChangeText={(text) => update('email', text)} keyboardType="email-address" autoCapitalize="none" />
        <Field label="Web" value={form.website} onChangeText={(text) => update('website', text)} autoCapitalize="none" />
        <Field label="Nota" value={form.note} onChangeText={(text) => update('note', text)} multiline />

        <View style={styles.actions}>
          <Button title="Cancelar" variant="secondary" onPress={onCancel} />
          <Button title="Confirmar" onPress={() => onConfirm(ensureContact(form))} />
        </View>
      </View>
    </Modal>
  );
}

function Field({ label, value, onChangeText, ...textInputProps }: { label: string; value: string | undefined; onChangeText: (text: string) => void } & React.ComponentProps<typeof TextInput>) {
  const textValue = value ?? '';
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={textValue}
        onChangeText={onChangeText}
        placeholderTextColor={palette.muted}
        {...textInputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg, padding: spacing.md, gap: spacing.md },
  title: { color: palette.text, fontSize: 22, fontWeight: '700' },
  field: { gap: 4 },
  label: { color: palette.muted, fontSize: 12, textTransform: 'uppercase', fontWeight: '600' },
  input: { color: palette.text, borderWidth: 1, borderColor: palette.border, borderRadius: 12, padding: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end' },
});
