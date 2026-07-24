import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { palette, spacing } from '../components';

type SettingRowProps = {
  label: string;
  description?: string;
  onPress?: () => void;
  action?: string;
};

function SettingRow({ label, description, onPress, action }: SettingRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      <View style={styles.textGroup}>
        <Text style={styles.label}>{label}</Text>
        {!!description && <Text style={styles.description}>{description}</Text>}
      </View>
      {!!action && <Text style={styles.action}>{action}</Text>}
    </Pressable>
  );
}

export function SettingsScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Ajustes</Text>
      <View style={styles.card}>
        <SettingRow label="Cámara" description="Permiso para escanear tarjetas" action="Conceder" />
        <SettingRow label="Contactos" description="Permiso para guardar contactos" action="Conceder" />
        <SettingRow label="Onboarding" description="Repetir la introducción" action="Reiniciar" />
        <SettingRow label="Versión" description="CardParse MVP" action="0.1.0" />
      </View>
      <Text style={styles.help}>
        CardParse funciona en local sin cuenta ni conexión obligatoria. Los contactos se guardan en el dispositivo.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg, padding: spacing.md, gap: spacing.md },
  title: { color: palette.text, fontSize: 22, fontWeight: '700' },
  card: { backgroundColor: '#0f1622', borderRadius: 16, borderWidth: 1, borderColor: '#20293a', padding: spacing.md, gap: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
  textGroup: { flex: 1, gap: 2 },
  label: { color: palette.text, fontSize: 15, fontWeight: '600' },
  description: { color: palette.muted, fontSize: 13 },
  action: { color: palette.accent, fontWeight: '700' },
  help: { color: palette.muted, fontSize: 13 },
});
