import * as React from 'react';
import Chat from './Chat';
import Settings from './Settings';
import 'react-native-gesture-handler';
import { Button, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ChatStackScreen extends React.Component {

  render() {
    const { name, selectedColor, defaultTextColor, uid } = this.props.route.params;
    // const Tab = createBottomTabNavigator();
    const Drawer = createDrawerNavigator();
    return (
      <>
        <Drawer.Navigator
          //initially goes to Chat screen
          initialRouteName='Chat'>
          <Drawer.Screen
            //initial props
            initialParams={{
              name: name,
              selectedColor: selectedColor,
              defaultTextColor: defaultTextColor,
              uid: uid
            }}
            name='Chat'
            component={Chat} />
          <Drawer.Screen
            //initial props
            initialParams={{
              name: name,
              selectedColor: selectedColor,
              defaultTextColor: defaultTextColor,
              uid: uid
            }}
            name='Settings'
            component={Settings} />
        </Drawer.Navigator>
      </>
    );
  }
}
