import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { palette, spacing } from '../config/theme';
import { useHistory } from '../features/history/useHistory';
import { ContactDetailScreen } from './ContactDetailScreen';

export function HistoryScreen() {
  const { contacts, ready, query, setQuery, searchContacts, remove } = useHistory();
  const [selected, setSelected] = useState<null | any>(null);

  if (selected) {
    return <ContactDetailScreen contact={selected} onBack={() => setSelected(null)} />;
  }

  const visible = searchContacts;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial</Text>
        <Text style={styles.subtitle}>{ready ? `${contacts.length} contactos` : 'Cargando...'}</Text>
      </View>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar nombre, email o teléfono..."
        placeholderTextColor={palette.muted}
        style={styles.search}
      />

      {visible.length === 0 ? (
        <Text style={styles.empty}>{query ? 'Sin resultados.' : 'Aún no hay contactos escaneados.'}</Text>
      ) : (
        visible.map((item) => (
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
  search: {
    backgroundColor: palette.bg,
    color: palette.text,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
  },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: palette.border },
  name: { color: palette.text, fontSize: 15, fontWeight: '600' },
  detail: { color: palette.muted, fontSize: 13 },
  danger: { color: '#ff6b6b', fontWeight: '700' },
});
