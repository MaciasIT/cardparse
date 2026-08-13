import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { palette, spacing } from '../components';
import { Button, Input } from '../components';
import { loadProviderConfig, saveProviderConfig } from '../lib/storage';
import { ProviderConfig } from '../types/contact';
import { useLocale, SupportedLocale } from '../config/useLocale';

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

export function SettingsScreen({ onRestartOnboarding }: { onRestartOnboarding?: () => void }) {
  const [config, setConfig] = useState<ProviderConfig | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [editing, setEditing] = useState(false);
  const [endpoint, setEndpoint] = useState('');
  const [model, setModel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<number | undefined>(undefined);
  const [locale, setLocale] = useState<SupportedLocale>('es');

  const { t, ready } = useLocale();

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
      setError(t('settings_required_fields'));
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
  }, [config, endpoint, model, apiKey, enabled, t]);

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

  const changeLocale = useCallback(async (next: SupportedLocale) => {
    setLocale(next);
    // Runtime-only for now; persistence hook could be added later without changing the UI path.
  }, []);

  const configured = !!config && !!config.endpoint && !!config.model && !!config.apiKey;

  if (!ready) {
    return (
      <View style={styles.root}>
        <Text style={styles.title}>{t('settings_title')}</Text>
        <Text style={styles.description}>{t('settings_loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{t('settings_title')}</Text>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>{t('settings_ocr_provider')}</Text>

        {!loaded ? (
          <Text style={styles.description}>{t('settings_loading')}</Text>
        ) : !configured && !editing ? (
          <SettingRow
            label={t('settings_not_configured')}
            description={t('settings_not_configured_desc')}
            action={t('settings_configure')}
            onPress={startEdit}
          />
        ) : editing ? (
          <>
            <Text style={styles.fieldLabel}>{t('settings_endpoint')}</Text>
            <Input
              value={endpoint}
              onChangeText={setEndpoint}
              placeholder="https://api.openrouter.ai/api/v1"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
            <Text style={styles.fieldLabel}>{t('settings_model')}</Text>
            <Input
              value={model}
              onChangeText={setModel}
              placeholder="google/gemini-2.0-flash-001"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.fieldLabel}>{t('settings_api_key')}</Text>
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
              <Button title={t('settings_save')} onPress={save} />
              <Button title={t('review_cancel')} variant="secondary" onPress={cancelEdit} />
            </View>
          </>
        ) : configured && config ? (
          <>
            <SettingRow label={t('settings_endpoint')} description={config.endpoint} />
            <SettingRow label={t('settings_model')} description={config.model} />
            <SettingRow
              label={t('settings_api_key')}
              description={maskApiKey(config.apiKey ?? '')}
              action={t('settings_edit')}
              onPress={startEdit}
            />
            <View style={styles.row}>
              <View style={styles.textGroup}>
                <Text style={styles.label}>{t('settings_enabled_on')}</Text>
                <Text style={styles.description}>{enabled ? t('settings_enabled_on') : t('settings_enabled_off')}</Text>
              </View>
              <Switch
                value={enabled}
                onValueChange={toggleEnabled}
                trackColor={{ false: palette.border, true: palette.accentMuted }}
                thumbColor={enabled ? palette.accent : palette.muted}
              />
            </View>
            {!!lastSaved && (
              <Text style={styles.lastSaved}>{t('settings_last_saved', formatLastSaved(lastSaved) ?? '')}</Text>
            )}
          </>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>{t('settings_language')}</Text>
        <View style={styles.row}>
          <SettingRow
            label={t('settings_language_es')}
            description={t('settings_language_desc', locale)}
            action={locale === 'es' ? '✓' : undefined}
            onPress={() => changeLocale('es')}
          />
          <SettingRow
            label={t('settings_language_en')}
            description={t('settings_language_desc', locale)}
            action={locale === 'en' ? '✓' : undefined}
            onPress={() => changeLocale('en')}
          />
        </View>
        <SettingRow label={t('settings_camera')} description={t('settings_camera_desc')} action={t('settings_configure')} />
        <SettingRow label={t('settings_contacts')} description={t('settings_contacts_desc')} action={t('settings_configure')} />
        <SettingRow
          label={t('settings_onboarding')}
          description={t('settings_onboarding_desc')}
          action={t('settings_restart')}
          onPress={onRestartOnboarding}
        />
        <SettingRow label={t('settings_version')} description="CardParse MVP" action="0.1.0" />
      </View>

      <Text style={styles.help}>{t('settings_help')}</Text>
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
