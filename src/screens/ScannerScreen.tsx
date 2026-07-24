import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { palette, spacing } from '../config/theme';
import { Button } from '../components';

export type ScannerScreenProps = {
  onCapture?: (uri: string) => void;
};

export function ScannerScreen({ onCapture }: ScannerScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();

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

  return (
    <View style={styles.root}>
      <CameraView style={styles.camera} facing="back" />
      <View style={styles.bottomAction}>
        <Button title="Simular captura" onPress={() => onCapture?.('file://demo-capture.jpg')} />
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
});
