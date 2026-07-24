import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { palette, spacing, typography } from '../config/theme';

type Props = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
};

export function Card({ title, description, children, style }: Props) {
  return (
    <View style={[styles.wrapper, style]}>
      {(title || description) && (
        <View>
          {!!title && <Text style={styles.title}>{title}</Text>}
          {!!description && <Text style={styles.description}>{description}</Text>}
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: palette.bgSecondary,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.xs,
  },
  title: { color: palette.text, fontSize: typography.heading, fontWeight: '700' },
  description: { color: palette.muted, fontSize: typography.body },
});
