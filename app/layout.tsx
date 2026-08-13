import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { palette, spacing } from '../src/components';
import { ScannerScreen } from '../src/screens/ScannerScreen';
import { HistoryScreen } from '../src/screens/HistoryScreen';
import { SettingsScreen } from '../src/screens/SettingsScreen';
import { OnboardingScreen } from '../src/screens/OnboardingScreen';
import storage from '../src/lib/mmkv';
import { STORAGE_KEYS } from '../src/lib/storage';
import { LocaleProvider } from '../src/config/LocaleContext';

const Tab = createBottomTabNavigator();

export default function Layout() {
  const [onboardingDone, setOnboardingDone] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    (async () => {
      const done = await storage.getBoolean(STORAGE_KEYS.onboarding);
      setOnboardingDone(done === true);
    })();
  }, []);

  const handleRestartOnboarding = React.useCallback(async () => {
    await storage.remove(STORAGE_KEYS.onboarding);
    setOnboardingDone(false);
  }, []);

  if (onboardingDone === null) {
    return <View style={styles.loading} />;
  }

  return (
    <LocaleProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Scanner"
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: palette.bg, borderTopColor: palette.border },
            tabBarActiveTintColor: palette.accent,
            tabBarInactiveTintColor: palette.muted,
          }}
        >
          <Tab.Screen name="Scanner">
            {() => <ScannerScreen />}
          </Tab.Screen>
          <Tab.Screen name="Historial">
            {() => <HistoryScreen />}
          </Tab.Screen>
          <Tab.Screen name="Ajustes">
            {() => <SettingsScreen onRestartOnboarding={handleRestartOnboarding} />}
          </Tab.Screen>
        </Tab.Navigator>

        {!onboardingDone && (
          <View style={styles.overlay}>
            <OnboardingScreen onFinish={() => setOnboardingDone(true)} />
          </View>
        )}
      </NavigationContainer>
    </LocaleProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: palette.bg },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: palette.bg,
    zIndex: 10,
  },
});
