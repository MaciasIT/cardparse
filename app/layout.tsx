import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Card, palette, spacing, typography } from './components';
import { ScannerScreen } from './screens/ScannerScreen';
import { ContactDetailScreen } from './screens/ContactDetailScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { parseContact } from './features/parser/contactParser';
import { downloadVCard } from './features/export/vcard';
import { useHistory } from './features/history/useHistory';
import { Contact } from './types/contact';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ScannerFlow() {
  const history = useHistory();

  const handleCapture = (rawText: string) => {
    const result = parseContact(rawText);
    history.add(result.contact);
  };

  const handleShare = (contact: Contact) => {
    const vcard = downloadVCard(contact);
    console.log('[vcard]\n', vcard);
  };

  return (
    <ScannerScreen
      onCapture={handleCapture}
      onContactReady={(contact) => handleShare(contact)}
    />
  );
}

export default function Layout() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Root" component={RootTabs} options={{ headerShown: false }} />
        <Stack.Screen name="ContactDetail" component={ContactDetailScreen} options={({ route }) => ({ title: 'Detalle' })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function RootTabs() {
  return (
    <Tab.Navigator initialRouteName="Scanner" screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: palette.bg, borderTopColor: palette.border }, tabBarActiveTintColor: palette.accent, tabBarInactiveTintColor: palette.muted }}>
      <Tab.Screen name="Scanner" component={ScannerFlow} />
      <Tab.Screen name="Historial" component={HistoryScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
