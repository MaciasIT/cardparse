import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { palette, spacing } from '../config/theme';
import { Button } from '../components';

export type ScannerScreenProps = {
  onCapture?: (uri: string) => void;
};

export function ScannerScreen({ onCapture }: ScannerScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState(new Animated.Value(0));

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Cargando cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Necesitamos acceso a la cámara para escanear tarjetas.</Text>
        <Button title="Conceder permiso" onPress={requestPermission} />
      </View>
    );
  }

  const handleSimulatedCapture = () => {
    if (busy) return;
    setBusy(true);
    onCapture?.('file://demo-capture.jpg');
    Animated.sequence([
      Animated.timing(flash, { toValue: 1, duration: 120, useNativeDriver: true }),
      Animated.timing(flash, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => setBusy(false));
  };

  return (
    <View style={styles.root}>
      <CameraView style={styles.camera} facing="back" />
      <Animated.View style={[styles.flashOverlay, { opacity: flash }]} />
      <View style={styles.bottomAction}>
        <Button title={busy ? 'Capturando...' : 'Simular captura'} onPress={handleSimulatedCapture} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg },
  camera: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.bg, gap: spacing.md },
  text: { color: palette.text },
  bottomAction: { position: 'absolute', bottom: spacing.lg, left: spacing.md, right: spacing.md },
  flashOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#ffffff', pointerEvents: 'none' },
});
