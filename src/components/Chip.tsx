import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { palette, spacing } from '../config/theme';

type Props = {
  label: string;
  active?: boolean;
  onToggle?: (active: boolean) => void;
  style?: ViewStyle;
};

export function Chip({ label, active, onToggle, style }: Props) {
  return (
    <View style={[styles.wrapper, active && styles.active, style]}>
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.chipBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  active: { backgroundColor: palette.accentMuted, borderColor: palette.accent },
  text: { color: palette.muted, fontSize: 12, fontWeight: '600' },
  activeText: { color: palette.text },
});
