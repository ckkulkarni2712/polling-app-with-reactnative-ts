import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Base from './app/Base';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RawJSON from './app/RawJSON';
const stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen
          name="Home"
          component={Base} />
        <stack.Screen
          name="Raw JSON"
          component={RawJSON}
        />
      </stack.Navigator>
    
    </NavigationContainer>
  );
}

