import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, palette, spacing } from '../components';
import { useHistory } from '../features/history/useHistory';

export function HistoryScreen() {
  const { contacts, ready } = useHistory();

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial</Text>
        <Text style={styles.subtitle}>{ready ? `${contacts.length} contactos` : 'Cargando...'}</Text>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card title={item.name} description={item.email ?? item.phone ?? 'Sin detalle'} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aún no hay contactos escaneados.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg, padding: spacing.md },
  header: { paddingBottom: spacing.sm },
  title: { color: palette.text, fontSize: 22, fontWeight: '700' },
  subtitle: { color: palette.muted, fontSize: 14, marginTop: 4 },
  list: { gap: spacing.sm },
  empty: { color: palette.muted, fontSize: 14 },
});
