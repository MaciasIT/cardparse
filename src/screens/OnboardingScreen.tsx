import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { palette, spacing } from '../components';
import storage from '../lib/mmkv';
import { STORAGE_KEYS } from '../lib/storage';

export function OnboardingScreen({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    (async () => {
      const seen = await storage.getBoolean(STORAGE_KEYS.onboarding);
      if (seen) onFinish();
    })();
  }, [onFinish]);

  const handleNext = useCallback(async () => {
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    await storage.setBoolean(STORAGE_KEYS.onboarding, true);
    onFinish();
  }, [onFinish, step]);

  const content = [introText(), detailText(), doubleSideText()][step];

  return (
    <View style={styles.root}>
      <Text style={styles.step}>{step + 1} / 3</Text>
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.subtitle}>{content.body}</Text>
      <Pressable style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonLabel}>{step < 2 ? 'Siguiente' : 'Empezar'}</Text>
      </Pressable>
    </View>
  );
}

function introText() {
  return {
    title: 'CardParse',
    body: 'Escanea tarjetas de visita y extrae automáticamente nombre, email y teléfono.',
  };
}

function detailText() {
  return {
    title: 'Guarda y comparte',
    body: 'Revisa el historial, edita datos y comparte vCards con un toque.',
  };
}

function doubleSideText() {
  return {
    title: 'Doble cara',
    body: 'Gira la tarjeta y escanea también el reverso: CardParse une ambas caras en un solo contacto.',
  };
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.md, gap: spacing.md },
  step: { color: palette.muted, fontSize: 13, fontWeight: '600' },
  title: { color: palette.text, fontSize: 28, fontWeight: '700' },
  subtitle: { color: palette.muted, fontSize: 15, textAlign: 'center' },
  button: { backgroundColor: palette.accent, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 999 },
  buttonLabel: { color: '#ffffff', fontWeight: '700' },
});
