import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, palette, spacing } from '../components';
import { usePermissions } from '../features/settings/permissions';

export function SettingsScreen() {
  const { camera, contacts } = usePermissions();

  const StatusBlock = ({ label, status }: { label: string; status: string }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, status === 'granted' ? styles.good : styles.bad]}>
        {status === 'granted' ? 'Concedido' : status === 'denied' ? 'Denegado' : 'Pendiente'}
      </Text>
    </View>
  );

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Ajustes</Text>
      <View style={styles.card}>
        <StatusBlock label="Cámara" status={camera} />
        <StatusBlock label="Contactos" status={contacts} />
      </View>
      <Text style={styles.help}>
        Si denegaste un permiso, actívalo desde los ajustes del sistema para usar esa función.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg, padding: spacing.md, gap: spacing.md },
  title: { color: palette.text, fontSize: 22, fontWeight: '700' },
  card: { backgroundColor: palette.bgSecondary, borderRadius: 16, borderWidth: 1, borderColor: palette.border, padding: spacing.md, gap: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: palette.muted, fontSize: 14 },
  value: { fontSize: 14, fontWeight: '700' },
  good: { color: palette.success },
  bad: { color: palette.danger },
  help: { color: palette.muted, fontSize: 13 },
});
