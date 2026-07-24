import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Contact } from '../types/contact';
import { Card, Button, Chip, palette, spacing } from '../components';
type Props = {
  contact: {
    name: string;
    company?: string;
    email?: string;
    phone?: string;
    website?: string;
    note?: string;
    source: 'front' | 'back' | 'both';
  };
  onBack: () => void;
};

export function ContactDetail({ contact, onBack }: Props) {
  const rows = [
    ['Nombre', contact.name],
    ['Empresa', contact.company],
    ['Email', contact.email],
    ['Teléfono', contact.phone],
    ['Web', contact.website],
    ['Nota', contact.note],
  ];

  const faceLabel = contact.source === 'front' ? 'Cara A' : contact.source === 'back' ? 'Cara B' : 'Doble cara';

  return (
    <View style={styles.root}>
      <Card title="Contacto" description={faceLabel}>
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

      <Chip label={faceLabel} active />
      <View style={styles.footer}>
        <Button title="Volver" variant="secondary" onPress={onBack} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg, padding: spacing.md, gap: spacing.md },
  row: { gap: 4 },
  label: { color: palette.muted, fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  value: { color: palette.text, fontSize: 15 },
  footer: { marginTop: spacing.sm },
});
