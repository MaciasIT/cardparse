import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, palette, spacing } from '../components';
import { Contact } from '../types/contact';

type Props = {
  contact: Contact;
  onShareVCard?: (contact: Contact) => void;
  onBack?: () => void;
};

export function ContactDetailScreen({ contact, onShareVCard, onBack }: Props) {
  const rows = [
    ['Nombre', contact.name],
    ['Empresa', contact.company],
    ['Email', contact.email],
    ['Teléfono', contact.phone],
    ['Web', contact.website],
    ['Nota', contact.note],
  ];

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Card title="Contacto" description={`${contact.source === 'front' ? 'Cara A' : contact.source === 'back' ? 'Cara B' : 'Doble cara'}`}>
        {rows.map(([label, value]) => {
          if (!value) return null;
          return (
            <View key={label} style={styles.row}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          );
        })}
      </Card>

      <Button title="Compartir vCard" onPress={() => onShareVCard?.(contact)} />
      {!!onBack && <Button title="Volver" variant="secondary" onPress={onBack} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg, padding: spacing.md, gap: spacing.md },
  row: { gap: 4 },
  label: { color: palette.muted, fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  value: { color: palette.text, fontSize: 15 },
});
