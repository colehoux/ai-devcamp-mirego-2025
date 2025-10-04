import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BasketProvider } from './src/store/BasketContext';
import SearchScreen from './src/screens/SearchScreen';
import BasketScreen from './src/screens/BasketScreen';
import CompareScreen from './src/screens/CompareScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <BasketProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Search"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Basket" component={BasketScreen} />
          <Stack.Screen name="Compare" component={CompareScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </BasketProvider>
  );
}
