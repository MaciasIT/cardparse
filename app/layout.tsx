import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

function Placeholder({ title }: { title: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B0F14' }}>
      <Text style={{ color: '#E8ECF1', fontSize: 18 }}>{title}</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: '#0B0F14', borderTopColor: '#1E2730' },
          tabBarActiveTintColor: '#D4A017',
          tabBarInactiveTintColor: '#8A95A3'
        }}
      >
        <Tab.Screen name="Scanner" component={() => <Placeholder title="Scanner" />} />
        <Tab.Screen name="Historial" component={() => <Placeholder title="Historial" />} />
        <Tab.Screen name="Ajustes" component={() => <Placeholder title="Ajustes" />} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
