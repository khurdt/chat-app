import React from 'react';
import { StyleSheet } from 'react-native';
import Start from './components/Start';
import Chat from './components/Chat';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  render() {
    const stack = createStackNavigator();
    return (
      <>

        <NavigationContainer>
          <stack.Navigator initialRouteName='Start'>
            <stack.Screen options={{ headerShown: false }} name='Start' component={Start} />
            <stack.Screen name='Chat' component={Chat} />
          </stack.Navigator>
        </NavigationContainer>
      </>
    );
  }
}

const styles = StyleSheet.create({})

