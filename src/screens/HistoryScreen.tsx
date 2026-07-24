import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { palette, spacing } from '../config/theme';
import { useHistory } from '../features/history/useHistory';
import { ContactDetailScreen } from './ContactDetailScreen';

export function HistoryScreen() {
  const { contacts, ready, remove } = useHistory();
  const [selected, setSelected] = useState<null | any>(null);

  if (selected) {
    return <ContactDetailScreen contact={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial</Text>
        <Text style={styles.subtitle}>{ready ? `${contacts.length} contactos` : 'Cargando...'}</Text>
      </View>

      {contacts.length === 0 ? (
        <Text style={styles.empty}>Aún no hay contactos escaneados.</Text>
      ) : (
        contacts.map((item) => (
          <Pressable key={item.id} style={styles.item} onPress={() => setSelected(item)}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.detail}>{item.email ?? item.phone ?? 'Sin detalle'}</Text>
            </View>
            <Pressable onPress={() => remove(item.id)}>
              <Text style={styles.danger}>Borrar</Text>
            </Pressable>
          </Pressable>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg, padding: spacing.md, gap: spacing.md },
  header: { paddingBottom: spacing.sm },
  title: { color: palette.text, fontSize: 22, fontWeight: '700' },
  subtitle: { color: palette.muted, fontSize: 14, marginTop: 4 },
  empty: { color: palette.muted, fontSize: 14 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: palette.border },
  name: { color: palette.text, fontSize: 15, fontWeight: '600' },
  detail: { color: palette.muted, fontSize: 13 },
  danger: { color: '#ff6b6b', fontWeight: '700' },
});
