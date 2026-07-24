import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Card, Chip, Input, palette, spacing, typography } from '@/components';
import { ScannerScreen, HistoryScreen, SettingsScreen } from '@/screens';

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

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: palette.bg,
    padding: spacing.md,
    gap: spacing.md,
  },
});
