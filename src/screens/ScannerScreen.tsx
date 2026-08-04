import React, { useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { palette, spacing } from '../config/theme';
import { Button } from '../components';
import { loadProviderConfig } from '../lib/storage';
import { normalizeOcrResponse } from '../features/ocr/normalizeOcrResponse';
import { OcrService } from '../features/ocr/ocrService';
import { parseContact } from '../features/parser/contactParser';
import { combineSides } from '../features/parser/combineSides';
import { cropImage } from '../features/camera/cropToContent';
import { ReviewScreen } from './ReviewScreen';
import { shareContactVCard } from '../features/export/share';
import type { Contact, ScanMetadata } from '../types/contact';

export type ScannerScreenProps = {
  onCapture?: (uri: string) => void;
};

type ScanPhase = 'idle' | 'front-captured' | 'back-captured';

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
  const ocrService = useRef(new OcrService()).current;
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [frontText, setFrontText] = useState<string | null>(null);
  const [backText, setBackText] = useState<string | null>(null);
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

  function showProviderAlert() {
    Alert.alert(
      'Proveedor OCR no configurado',
      'No hay un proveedor OCR activo. Ve a Ajustes para configurarlo.',
      [
        { text: 'Ajustes', onPress: () => {} },
        { text: 'OK', style: 'cancel' },
      ]
    );
  }

  async function processImage(uri: string): Promise<{ rawText: string; processingMs: number }> {
    const config = await loadProviderConfig();

    if (!config?.enabled || !config?.endpoint || !config?.apiKey) {
      showProviderAlert();
      throw new Error('PROVIDER_NOT_CONFIGURED');
    }

    // T19: recorte automático de bordes antes del OCR. Si falla, usa la original.
    const imageUri = await cropImage(uri);
    const base64 = await readImageAsBase64(imageUri);

    if (!base64 || base64.length === 0) {
      throw new Error('No se pudo codificar la imagen a base64.');
    }

    const ac = new AbortController();
    const result = await ocrService.execute(config, base64, ac.signal);
    ocrService.cancel();

    const providerResponse = normalizeOcrResponse({ rawText: result.rawText });
    return { rawText: providerResponse.rawText, processingMs: result.processingMs };
  }

  async function handleCaptureFront() {
    if (busy) return;
    setBusy(true);

    try {
      const photo = await cameraRef.current?.takePictureAsync?.();
      if (!photo?.uri) {
        Alert.alert('Error', 'No se pudo capturar la imagen.');
        return;
      }

      const { rawText } = await processImage(photo.uri);
      setFrontText(rawText);
      setPhase('front-captured');
      setBusy(false);
      onCapture?.(photo.uri);
    } catch (err) {
      setBusy(false);
      if (err instanceof Error && err.message === 'PROVIDER_NOT_CONFIGURED') return;
      const msg = err instanceof Error ? err.message : 'Error desconocido al procesar la imagen';
      Alert.alert('Error al procesar', msg);
    }
  }

  async function handleCaptureBack() {
    if (busy) return;
    setBusy(true);

    try {
      const photo = await cameraRef.current?.takePictureAsync?.();
      if (!photo?.uri) {
        Alert.alert('Error', 'No se pudo capturar la imagen.');
        return;
      }

      const { rawText: backRaw, processingMs } = await processImage(photo.uri);
      setBackText(backRaw);
      setPhase('back-captured');
      setBusy(false);
      onCapture?.(photo.uri);

      const combined = combineSides(frontText, backRaw);
      const parsed = parseContact(combined);

      const metadata: ScanMetadata = {
        contactId: parsed.contact.id,
        ocrProvider: 'external',
        rawTextFront: frontText ?? '',
        rawTextBack: backRaw,
        processingMs,
      };

      const pending: Contact = {
        ...parsed.contact,
        source: 'both',
        updatedAt: Date.now(),
      };

      void metadata;
      setPendingContact(pending);
    } catch (err) {
      setBusy(false);
      if (err instanceof Error && err.message === 'PROVIDER_NOT_CONFIGURED') return;
      const msg = err instanceof Error ? err.message : 'Error desconocido al procesar la imagen';
      Alert.alert('Error al procesar', msg);
    }
  }

  function handleRedoFront() {
    setFrontText(null);
    setPhase('idle');
  }

  function handleRedoBack() {
    // Reinicia solo la cara A; conserva backText en memoria (se sobrescribe al re-capturar B).
    setFrontText(null);
    setPhase('idle');
  }

  function handleReviewConfirm(contact: Contact) {
    setPendingContact(null);
    setFrontText(null);
    setBackText(null);
    setPhase('idle');
    Alert.alert('Contacto confirmado', contact.name || 'Sin nombre');
  }

  function handleReviewCancel() {
    setPendingContact(null);
  }

  function handleCancelDoubleSide() {
    setFrontText(null);
    setBackText(null);
    setPhase('idle');
  }

  const title =
    phase === 'idle'
      ? 'Capturar cara A'
      : phase === 'front-captured'
        ? 'Capturar cara B'
        : 'Ambas caras capturadas';

  return (
    <View style={styles.root}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <Animated.View style={[styles.flashOverlay, { opacity: flash }]} />
      <View style={styles.bottomAction}>
        <Text style={styles.phaseTitle}>{title}</Text>

        {phase === 'idle' && (
          <Button title={busy ? 'Procesando...' : 'Capturar y procesar'} onPress={handleCaptureFront} />
        )}

        {phase === 'front-captured' && (
          <>
            <View style={styles.extractedBox}>
              <Text style={styles.extractedLabel}>Texto cara A extraído:</Text>
              <Text style={styles.extractedText} numberOfLines={3}>
                {frontText}
              </Text>
            </View>
            <View style={styles.rowActions}>
              <Button title={busy ? 'Procesando...' : 'Capturar cara B'} onPress={handleCaptureBack} style={styles.flexButton} />
              <Button title="Rehacer" variant="secondary" onPress={handleRedoFront} style={styles.flexButton} />
            </View>
            <Button title="Cancelar" variant="ghost" onPress={handleCancelDoubleSide} />
          </>
        )}

        {phase === 'back-captured' && (
          <>
            <View style={styles.extractedBox}>
              <Text style={styles.extractedLabel}>Ambas caras capturadas</Text>
              <Text style={styles.extractedText} numberOfLines={2}>
                {backText}
              </Text>
            </View>
            <View style={styles.rowActions}>
              <Button title="Rehacer cara A" variant="secondary" onPress={handleRedoBack} style={styles.flexButton} />
              <Button title="Cancelar" variant="ghost" onPress={handleCancelDoubleSide} style={styles.flexButton} />
            </View>
          </>
        )}
      </View>

      <ReviewScreen
        visible={!!pendingContact}
        contact={pendingContact ?? { id: '', name: '', source: 'both', createdAt: Date.now(), updatedAt: Date.now() }}
        onConfirm={handleReviewConfirm}
        onCancel={handleReviewCancel}
        onShare={shareContactVCard}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg },
  camera: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.bg, gap: spacing.md },
  text: { color: palette.text },
  bottomAction: { position: 'absolute', bottom: spacing.lg, left: spacing.md, right: spacing.md, gap: spacing.sm },
  phaseTitle: { color: palette.text, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  extractedBox: { backgroundColor: 'rgba(11, 15, 20, 0.85)', borderRadius: 12, borderWidth: 1, borderColor: palette.border, padding: spacing.sm },
  extractedLabel: { color: palette.muted, fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  extractedText: { color: palette.text, fontSize: 14, marginTop: 4 },
  rowActions: { flexDirection: 'row', gap: spacing.sm },
  flexButton: { flex: 1 },
  flashOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#ffffff', pointerEvents: 'none' },
});
