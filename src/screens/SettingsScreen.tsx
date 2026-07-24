import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, spacing } from '../components';

export function SettingsScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Ajustes</Text>
      <Text style={styles.subtitle}>Próximamente: proveedor OCR, idioma, exportación y más.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg, padding: spacing.md, gap: spacing.sm },
  title: { color: palette.text, fontSize: 22, fontWeight: '700' },
  subtitle: { color: palette.muted, fontSize: 14 },
});
