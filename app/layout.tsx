import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, palette, spacing } from '../src/components';
import { ScannerScreen } from '../src/screens/ScannerScreen';
import { HistoryScreen } from '../src/screens/HistoryScreen';
import { SettingsScreen } from '../src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
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
        <Tab.Screen name="Scanner" component={ScannerScreen} />
        <Tab.Screen name="Historial" component={HistoryScreen} />
        <Tab.Screen name="Ajustes" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
