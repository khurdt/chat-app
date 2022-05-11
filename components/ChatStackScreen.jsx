import * as React from 'react';
import Chat from './Chat';
import Settings from './Settings';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';

export default class ChatStackScreen extends React.Component {

  render() {
    // const { uid, name, selectedColor, defaultTextColor } = this.props.route.params;
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
              newColor: '',
              newName: '',
              newDefaultTextColor: ''
            }}
            name='Chat'
            component={Chat} />
          <Drawer.Screen
            name='Settings'
            component={Settings} />
        </Drawer.Navigator>
      </>
    );
  }
}