import React, { useRef, useState, useEffect } from 'react';
import { Alert, Animated, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { palette, spacing } from '../config/theme';
import { Button } from '../components';
import { loadProviderConfig, saveActiveScanId, loadActiveScanId } from '../lib/storage';
import { normalizeOcrResponse } from '../features/ocr/normalizeOcrResponse';
import { OcrService } from '../features/ocr/ocrService';
import { parseContact } from '../features/parser/contactParser';
import { combineSides } from '../features/parser/combineSides';
import { cropImage } from '../features/camera/cropToContent';
import { ReviewScreen } from './ReviewScreen';
import { shareContactVCard } from '../features/export/share';
import { useBatchQueue } from '../features/batch/useBatchQueue';
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
  const batch = useBatchQueue();
  const [recovered, setRecovered] = useState(false);

  useEffect(() => {
    (async () => {
      const activeId = await loadActiveScanId();
      if (!activeId) return;
      const active = batch.items.find((item) => item.id === activeId);
      if (!active) return;

      if (active.status === 'review' && active.contact) {
        setPendingContact(active.contact);
        setPhase('back-captured');
        setFrontText(active.rawTextFront ?? '');
        setBackText(active.rawTextBack ?? '');
      } else if (active.status === 'processing') {
        setPhase('front-captured');
        setFrontText(active.rawTextFront ?? '');
      }
      setRecovered(true);
    })();
  }, []);

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
      const newItemId = await batch.enqueue({ uri: photo.uri, rawText });
      await batch.updateItem(newItemId, { rawTextFront: rawText });
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

      const current = batch.items.find((item) => item.status === 'processing' || item.status === 'capturing');
      const itemId = current?.id ?? batch.items[batch.items.length - 1]?.id;
      if (itemId) {
        await batch.updateItem(itemId, { rawTextBack: backRaw, contact: pending });
        await saveActiveScanId(itemId);
      }
      setPendingContact(pending);
    } catch (err) {
      setBusy(false);
      if (err instanceof Error && err.message === 'PROVIDER_NOT_CONFIGURED') return;
      const msg = err instanceof Error ? err.message : 'Error desconocido al procesar la imagen';
      Alert.alert('Error al procesar', msg);
    }
  }

  async function resetScanState() {
    await saveActiveScanId(null);
    setPendingContact(null);
    setFrontText(null);
    setBackText(null);
    setPhase('idle');
  }

  async function markCurrentDone() {
    const current = batch.items.find((item) => item.status === 'review' || item.status === 'processing');
    if (current) {
      await batch.updateItem(current.id, { status: 'done', contact: pendingContact ?? current.contact });
    }
    await resetScanState();
    const next = batch.items.find((item) => item.status === 'error' || item.status === 'capturing');
    if (next) {
      Alert.alert('Contacto confirmado', 'Continuando con el siguiente item del lote.');
    }
  }

  function handleReviewConfirm(contact: Contact) {
    markCurrentDone();
    Alert.alert('Contacto confirmado', contact.name || 'Sin nombre');
  }

  function handleReviewCancel() {
    resetScanState();
  }

  async function handleExportCurrent() {
    const contact = pendingContact;
    if (!contact) return;

    const exportedId = await batch.exportCurrent(contact);
    if (!exportedId) {
      Alert.alert('Export', 'No hay item actual para exportar.');
      return;
    }

    await shareContactVCard(contact);

    Alert.alert(
      'Contacto exportado',
      contact.name || 'Sin nombre',
      [
        { text: 'Siguiente', onPress: () => advanceAfterExport() },
        { text: 'Cerrar', onPress: resetScanState },
      ]
    );
  }

  function advanceAfterExport() {
    const next = batch.nextItemAfterExport();
    if (!next) {
      resetScanState();
      return;
    }

    if (next.status === 'error') {
      Alert.alert('Siguiente', 'Hay items con error pendientes en el lote.');
    } else {
      Alert.alert('Siguiente', 'Continuando con el siguiente item del lote.');
    }
  }

  function handleCancelDoubleSide() {
    resetScanState();
  }

  const title =
    phase === 'idle'
      ? 'Capturar cara A'
      : phase === 'front-captured'
        ? 'Capturar cara B'
        : 'Ambas caras capturadas';

  const activeBatchItem = recovered ? batch.items.find((item) => item.status === 'review' || item.status === 'processing') : null;
  const progress = batch.summary.total > 0 ? batch.summary.done / batch.summary.total : 0;

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
              <Text style={styles.extractedLabel}>{frontText ? 'Texto cara A extraído:' : 'Cara A capturada'}</Text>
              <Text style={styles.extractedText} numberOfLines={3}>
                {frontText}
              </Text>
            </View>
            <View style={styles.rowActions}>
              <Button title={busy ? 'Procesando...' : 'Capturar cara B'} onPress={handleCaptureBack} style={styles.flexButton} />
              <Button title="Rehacer" variant="secondary" onPress={() => { setFrontText(null); setPhase('idle'); saveActiveScanId(null); }} style={styles.flexButton} />
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
              <Button title="Rehacer cara A" variant="secondary" onPress={() => { setFrontText(null); setPhase('idle'); saveActiveScanId(null); }} style={styles.flexButton} />
              <Button title="Cancelar" variant="ghost" onPress={handleCancelDoubleSide} style={styles.flexButton} />
            </View>
          </>
        )}

        <View style={styles.batchBar}>
          <Text style={styles.batchStatus}>
            Lote: {batch.summary.total} · hechos {batch.summary.done} · pendientes {batch.summary.pending} · errores {batch.summary.failed}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
          </View>
          <View style={styles.rowActions}>
            <Button title="Reintentar errores" variant="secondary" onPress={batch.runAll} style={styles.flexButton} />
            <Button title="Limpiar lote" variant="ghost" onPress={async () => { await batch.clear(); await saveActiveScanId(null); }} style={styles.flexButton} />
            {!!pendingContact && (
              <Button title="Exportar" onPress={handleExportCurrent} style={styles.flexButton} />
            )}
          </View>
        </View>
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
  batchBar: { gap: spacing.sm },
  batchStatus: { color: palette.muted, fontSize: 12, textAlign: 'center' },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: palette.border, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: palette.accent },
  flashOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#ffffff', pointerEvents: 'none' },
});
