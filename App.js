import React from 'react';
import { StyleSheet, Button } from 'react-native';
import ChatStackScreen from './components/ChatStackScreen';
import Start from './components/Start';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class App extends React.Component {

  render() {
    const Stack = createStackNavigator();
    return (
      <>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Start'>
            <Stack.Screen options={{ headerShown: false }} name='Start' component={Start} />
            <Stack.Screen options={{ headerShown: false }} name='ChatStackScreen' component={ChatStackScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }
}

const styles = StyleSheet.create({})

