import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, spacing, Button } from '../components';

export function OnboardingScreen({ onFinish }: { onFinish: () => void }) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>CardParse</Text>
      <Text style={styles.subtitle}>Escanea tarjetas y guarda contactos en segundos.</Text>
      <Button title="Empezar" onPress={onFinish} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.md, gap: spacing.md },
  title: { color: palette.text, fontSize: 28, fontWeight: '700' },
  subtitle: { color: palette.muted, fontSize: 15, textAlign: 'center' },
});
