import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { palette, spacing } from '../components';
import storage from '../lib/mmkv';

const ONBOARDING_KEY = '@cardparse/onboarding/done';

export function OnboardingScreen({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    (async () => {
      const seen = await storage.getBoolean(ONBOARDING_KEY);
      if (seen) onFinish();
    })();
  }, [onFinish]);

  const handleNext = useCallback(async () => {
    if (step === 0) {
      setStep(1);
      return;
    }
    await storage.setBoolean(ONBOARDING_KEY, true);
    onFinish();
  }, [onFinish, step]);

  const content = step === 0 ? introText() : detailText();

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.subtitle}>{content.body}</Text>
      <Pressable style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonLabel}>{step === 0 ? 'Siguiente' : 'Empezar'}</Text>
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.md, gap: spacing.md },
  title: { color: palette.text, fontSize: 28, fontWeight: '700' },
  subtitle: { color: palette.muted, fontSize: 15, textAlign: 'center' },
  button: { backgroundColor: palette.accent, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 999 },
  buttonLabel: { color: '#ffffff', fontWeight: '700' },
});
