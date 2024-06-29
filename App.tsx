import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import MainScreen from './Screens/MainScreen';
import Screen2 from './Screens/Screen2';
import Screen3 from './Screens/Screen3';
import Screen4 from './Screens/Screen4';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={MainScreen} options={{
          headerTransparent: true,
          headerTitle: '',


        }}/>
        <Stack.Screen name="Screen2" component={Screen2} options={{
          headerTransparent: true,
          headerBackTitle: 'Back',
          headerTintColor: 'white',
          headerTitle: 'ChatGPT'
        }}/>
        <Stack.Screen name="Screen3" component={Screen3} options={{
          headerTransparent: true,
          headerBackTitle: 'Back',
          headerTintColor: 'white',
          headerTitle: 'ImageGPT'
        }}/>
        <Stack.Screen name="Screen4" component={Screen4} options={{
          headerTransparent: true,
          headerBackTitle: 'Back',
          headerTintColor: 'white',
          headerTitle: 'BackRemove'
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
