import React from 'react';
import { StyleSheet } from 'react-native';
import Chat from './Chat';
import Settings from './Settings';
import 'react-native-gesture-handler';
// import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ChatStackScreen extends React.Component {

  render() {
    const { name, selectedColor, defaultTextColor, uid } = this.props.route.params;
    const Tab = createBottomTabNavigator();
    let isRouteStart;
    return (
      <>
        <Tab.Navigator
          initialRouteName='Chat'
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Chat') {
                iconName = focused ? 'ios-person' : 'ios-person';
              }
              else if (route.name === 'Settings') {
                iconName = focused
                  ? 'ios-cog'
                  : 'ios-cog';
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'darkorange',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          {/* <Tab.Screen options={{ headerShown: false }} name='Start' component={Start} /> */}
          <Tab.Screen
            options={{ headerShown: false }}
            initialParams={{
              name: name,
              selectedColor: selectedColor,
              defaultTextColor: defaultTextColor,
              uid: uid
            }}
            name='Chat'
            component={Chat} />
          <Tab.Screen
            options={{ headerShown: false }}
            initialParams={{
              name: name,
              selectedColor: selectedColor,
              defaultTextColor: defaultTextColor,
              uid: uid
            }}
            name='Settings'
            component={Settings} />
        </Tab.Navigator>
      </>
    );
  }
}

const styles = StyleSheet.create({})