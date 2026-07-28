import React, { useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { palette, spacing } from '../config/theme';
import { Button } from '../components';
import { loadProviderConfig } from '../lib/storage';
import { normalizeOcrResponse } from '../features/ocr/normalizeOcrResponse';
import { OcrService } from '../features/ocr/ocrService';
import { parseContact } from '../features/parser/contactParser';
import { ReviewScreen } from './ReviewScreen';
import type { Contact, ScanMetadata } from '../types/contact';

export type ScannerScreenProps = {
  onCapture?: (uri: string) => void;
};

async function readImageAsBase64(uri: string): Promise<string> {
  const response = await fetch(uri);
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function ScannerScreen({ onCapture }: ScannerScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);
  const flash = useState(new Animated.Value(0))[0];
  const cameraRef = useRef<CameraView | null>(null);
  const ocrService = new OcrService();
  const [pendingContact, setPendingContact] = useState<Contact | null>(null);

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

  async function handleCapture() {
    if (busy) return;
    setBusy(true);

    try {
      const config = await loadProviderConfig();

      if (!config?.enabled || !config?.endpoint || !config?.apiKey) {
        Alert.alert(
          'Proveedor OCR no configurado',
          'No hay un proveedor OCR activo. Ve a Ajustes para configurarlo.',
          [
            { text: 'Ajustes', onPress: () => {} },
            { text: 'OK', style: 'cancel' },
          ]
        );
        setBusy(false);
        return;
      }

      const photo = await cameraRef.current?.takePictureAsync?.();
      if (!photo?.uri) {
        Alert.alert('Error', 'No se pudo capturar la imagen.');
        setBusy(false);
        return;
      }

      const base64 = await readImageAsBase64(photo.uri);

      if (!base64 || base64.length === 0) {
        Alert.alert('Error', 'No se pudo codificar la imagen a base64.');
        setBusy(false);
        return;
      }

      const ac = new AbortController();
      const result = await ocrService.execute(config, base64, ac.signal);
      ocrService.cancel();

      const providerResponse = normalizeOcrResponse({ rawText: result.rawText });
      const parsed = parseContact(providerResponse.rawText);

      const metadata: ScanMetadata = {
        contactId: parsed.contact.id,
        ocrProvider: 'external',
        rawTextFront: providerResponse.rawText,
        processingMs: result.processingMs,
      };

      const pending: Contact = {
        ...parsed.contact,
        source: 'both',
        updatedAt: Date.now(),
      };

      setPendingContact(pending);
      onCapture?.(photo.uri);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido al procesar la imagen';
      Alert.alert('Error al procesar', msg);
    } finally {
      setBusy(false);
    }
  }

  function handleReviewConfirm(contact: Contact) {
    setPendingContact(null);
    Alert.alert('Contacto confirmado', contact.name || 'Sin nombre');
  }

  function handleReviewCancel() {
    setPendingContact(null);
  }

  return (
    <View style={styles.root}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <Animated.View style={[styles.flashOverlay, { opacity: flash }]} />
      <View style={styles.bottomAction}>
        <Button title={busy ? 'Procesando...' : 'Capturar y procesar'} onPress={handleCapture} />
      </View>

      <ReviewScreen
        visible={!!pendingContact}
        contact={pendingContact ?? { id: '', name: '', source: 'both', createdAt: Date.now(), updatedAt: Date.now() }}
        onConfirm={handleReviewConfirm}
        onCancel={handleReviewCancel}
      />
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
