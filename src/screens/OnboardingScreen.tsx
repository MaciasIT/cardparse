import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, spacing, Button } from '../components';
import { ONBOARDING_DELAY } from '../config/constants';

const ONBOARDING_KEY = '@cardparse/onboarding/done';

export function OnboardingScreen({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);

  const handleNext = async () => {
    if (step === 0) {
      setStep(1);
      return;
    }

    await globalThis.localStorage?.setItem?.(ONBOARDING_KEY, '1');
    onFinish();
  };

  const content = step === 0 ? onboardingFirst() : onboardingSecond();

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.subtitle}>{content.body}</Text>
      <Button title={step === 0 ? 'Siguiente' : 'Empezar'} onPress={handleNext} />
    </View>
  );
}

function onboardingFirst() {
  return {
    title: 'CardParse',
    body: 'Escanea tarjetas de visita y extrae automáticamente nombre, email y teléfono.',
  };
}

function onboardingSecond() {
  return {
    title: 'Guarda y comparte',
    body: 'Revisa el historial, edita datos y comparte vCards con un toque.',
  };
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.md, gap: spacing.md },
  title: { color: palette.text, fontSize: 28, fontWeight: '700' },
  subtitle: { color: palette.muted, fontSize: 15, textAlign: 'center' },
});
