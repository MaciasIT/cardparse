import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Contact } from '../types/contact';
import { useHistory } from '../features/history/useHistory';
import { Card, Button, palette, spacing } from '../components';

type ListProps = {
  onSelect: (contact: Contact) => void;
};

export function HistoryList({ onSelect }: ListProps) {
  const { contacts, ready, remove } = useHistory();

  return (
    <View style={styles.root}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Card title={item.name} description={item.email ?? item.phone ?? 'Sin detalle'} style={styles.card} />
            <View style={styles.actions}>
              <Button title="Ver" variant="secondary" onPress={() => onSelect(item)} />
              <Button title="Borrar" onPress={() => remove(item.id)} />
            </View>
          </View>
        )}
        ListEmptyComponent={!ready ? <Text style={styles.empty}>Cargando...</Text> : <Text style={styles.empty}>Aún no hay contactos escaneados.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg, padding: spacing.md },
  list: { gap: spacing.md },
  row: { gap: spacing.sm },
  card: { flex: 1 },
  actions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end' },
  empty: { color: palette.muted, fontSize: 14 },
});
