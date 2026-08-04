import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { palette, spacing } from '../components';
import { Button, Input } from '../components';
import { loadProviderConfig, saveProviderConfig } from '../lib/storage';
import { ProviderConfig } from '../types/contact';

type SettingRowProps = {
  label: string;
  description?: string;
  onPress?: () => void;
  action?: string;
};

function SettingRow({ label, description, onPress, action }: SettingRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      <View style={styles.textGroup}>
        <Text style={styles.label}>{label}</Text>
        {!!description && <Text style={styles.description}>{description}</Text>}
      </View>
      {!!action && <Text style={styles.action}>{action}</Text>}
    </Pressable>
  );
}

function maskApiKey(key: string): string {
  if (!key) return '—';
  const tail = key.slice(-4);
  return `••••${tail}`;
}

function formatLastSaved(timestamp?: number): string | null {
  if (!timestamp) return null;
  try {
    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(timestamp));
  } catch {
    return null;
  }
}

export function SettingsScreen() {
  const [config, setConfig] = useState<ProviderConfig | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Form state
  const [editing, setEditing] = useState(false);
  const [endpoint, setEndpoint] = useState('');
  const [model, setModel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<number | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const stored = await loadProviderConfig();
      if (stored) {
        setConfig(stored);
        setEndpoint(stored.endpoint);
        setModel(stored.model);
        setApiKey(stored.apiKey ?? '');
        setEnabled(stored.enabled);
        setLastSaved(stored.updatedAt);
      }
      setLoaded(true);
    })();
  }, []);

  const startEdit = useCallback(() => {
    setError(null);
    setEditing(true);
  }, []);

  const cancelEdit = useCallback(() => {
    setError(null);
    setEditing(false);
    if (config) {
      setEndpoint(config.endpoint);
      setModel(config.model);
      setApiKey(config.apiKey ?? '');
      setEnabled(config.enabled);
    }
  }, [config]);

  const save = useCallback(async () => {
    if (!endpoint.trim() || !model.trim() || !apiKey.trim()) {
      setError('Endpoint, modelo y API key son obligatorios.');
      return;
    }
    const next: ProviderConfig = {
      id: config?.id ?? 'custom-provider',
      provider: config?.provider ?? 'custom',
      endpoint: endpoint.trim(),
      model: model.trim(),
      apiKey: apiKey.trim(),
      enabled,
      updatedAt: Date.now(),
    };
    await saveProviderConfig(next);
    setConfig(next);
    setLastSaved(next.updatedAt);
    setError(null);
    setEditing(false);
  }, [config, endpoint, model, apiKey, enabled]);

  const toggleEnabled = useCallback(
    async (value: boolean) => {
      setEnabled(value);
      if (config) {
        const next = { ...config, enabled: value, updatedAt: Date.now() };
        await saveProviderConfig(next);
        setConfig(next);
        setLastSaved(next.updatedAt);
      }
    },
    [config],
  );

  const configured = !!config && !!config.endpoint && !!config.model && !!config.apiKey;

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Ajustes</Text>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Proveedor OCR</Text>

        {!loaded ? (
          <Text style={styles.description}>Cargando…</Text>
        ) : !configured && !editing ? (
          <>
            <SettingRow
              label="Proveedor no configurado"
              description="Endpoint, modelo y API key necesarios para el OCR real"
              action="Configurar"
              onPress={startEdit}
            />
          </>
        ) : editing ? (
          <>
            <Text style={styles.fieldLabel}>Endpoint</Text>
            <Input
              value={endpoint}
              onChangeText={setEndpoint}
              placeholder="https://api.openrouter.ai/api/v1"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
            <Text style={styles.fieldLabel}>Modelo</Text>
            <Input
              value={model}
              onChangeText={setModel}
              placeholder="google/gemini-2.0-flash-001"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.fieldLabel}>API key</Text>
            <Input
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="sk-…"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />
            {!!error && <Text style={styles.error}>{error}</Text>}
            <View style={styles.actions}>
              <Button title="Guardar" onPress={save} />
              <Button title="Cancelar" variant="secondary" onPress={cancelEdit} />
            </View>
          </>
        ) : configured && config ? (
          <>
            <SettingRow label="Endpoint" description={config.endpoint} />
            <SettingRow label="Modelo" description={config.model} />
            <SettingRow
              label="API key"
              description={maskApiKey(config.apiKey ?? '')}
              action="Editar"
              onPress={startEdit}
            />
            <View style={styles.row}>
              <View style={styles.textGroup}>
                <Text style={styles.label}>Proveedor activo</Text>
                <Text style={styles.description}>{enabled ? 'Activo' : 'Desactivado'}</Text>
              </View>
              <Switch
                value={enabled}
                onValueChange={toggleEnabled}
                trackColor={{ false: palette.border, true: palette.accentMuted }}
                thumbColor={enabled ? palette.accent : palette.muted}
              />
            </View>
            {!!lastSaved && (
              <Text style={styles.lastSaved}>Última guardada: {formatLastSaved(lastSaved)}</Text>
            )}
          </>
        ) : null}
      </View>

      <View style={styles.card}>
        <SettingRow label="Cámara" description="Permiso para escanear tarjetas" action="Conceder" />
        <SettingRow label="Contactos" description="Permiso para guardar contactos" action="Conceder" />
        <SettingRow label="Onboarding" description="Repetir la introducción" action="Reiniciar" />
        <SettingRow label="Versión" description="CardParse MVP" action="0.1.0" />
      </View>

      <Text style={styles.help}>
        CardParse funciona en local sin cuenta ni conexión obligatoria. El OCR real solo se envía al
        proveedor que configures; los contactos se guardan en el dispositivo.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg, padding: spacing.md, gap: spacing.md },
  title: { color: palette.text, fontSize: 22, fontWeight: '700' },
  sectionLabel: { color: palette.muted, fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  card: {
    backgroundColor: palette.bgSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
  textGroup: { flex: 1, gap: 2 },
  label: { color: palette.text, fontSize: 15, fontWeight: '600' },
  description: { color: palette.muted, fontSize: 13 },
  action: { color: palette.accent, fontWeight: '700' },
  fieldLabel: { color: palette.text, fontSize: 14, fontWeight: '600', marginTop: spacing.xs },
  error: { color: palette.danger, fontSize: 13 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  lastSaved: { color: palette.muted, fontSize: 12, textAlign: 'right' },
  help: { color: palette.muted, fontSize: 13 },
});
