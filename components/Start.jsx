import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      selectedColor: '#090C08',
      defaultTextColor: 'white',
      lightColors: ['#8A95A5', '#B9C6AE', '#00FF00', '#FFFF00', '#00FFFF', '#C0C0C0'],
      isConnected: false
    }
  }
  //if user returns and warning is still displayed, take it away
  componentDidMount() {
    //getting authorization using imported auth and setting user if no user
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
      } else {
        this.setState({ isConnected: false });
      }
    })

    this.getUserInfo();
  }

  async getUserInfo() {
    let name, selectedColor, defaultTextColor;

    try {
      name = await AsyncStorage.getItem('name');
      selectedColor = await AsyncStorage.getItem('selectedColor');
      defaultTextColor = await AsyncStorage.getItem('defaultTextColor');
    } catch (error) {
      console.log(error);
    }

    if (name !== null) {
      this.setState({ name: name, selectedColor: selectedColor, defaultTextColor: defaultTextColor });
      this.handleAutoLogIn();
    }
  }

  //changes current color and text color depending on if color is light or dark
  handleColorChange = (color) => {
    this.setState({ selectedColor: color, defaultTextColor: (this.state.lightColors.includes(color)) ? 'black' : 'white' });
  }

  async saveUserInfo() {
    try {
      await AsyncStorage.setItem('name', this.state.name);
      await AsyncStorage.setItem('selectedColor', this.state.selectedColor);
      await AsyncStorage.setItem('defaultTextColor', this.state.defaultTextColor);
    } catch (error) {
      console.log(error);
    }
  }

  handleAutoLogIn() {
    this.props.navigation.navigate('ChatStackScreen')

  }

  //navigates to chat page if name is provided
  async handleLogIn() {
    (this.state.name === '') && this.Alert('please enter your name');
    if (this.state.name !== '') {
      await this.saveUserInfo();
      this.props.navigation.navigate('ChatStackScreen')
    }
  }

  Alert(message) {
    Alert.alert(message);
  }
  render() {
    const { name, selectedColor, defaultTextColor } = this.state;
    const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE', '#FF0000', '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080', '#800000', '#808000', '#008000', '#800080', '#008080', '#000080']

    return (
      <>
        <View style={{ flex: 1 }} >
          <KeyboardAvoidingView style={{ flex: 1 }} behavior='height' >
            <Image style={styles.backgroundImage} source={require('../assets/BackgroundImage.png')} />
            <View style={{ flex: 20, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.title}>Chatter</Text>
            </View>
            <ScrollView>
              <View style={styles.container} >
                <View style={{ flex: 1 }}>
                  <TextInput
                    accessible={true}
                    accessibilityLabel='input for name'
                    style={[styles.chooseText, styles.nameInput, { borderColor: selectedColor }]}
                    onChangeText={(name) => this.setState({ name })}
                    value={name}
                    placeholder='Type your name...'
                  />
                </View>
                <Text style={styles.chooseText}>Choose Background Color</Text>
                <ScrollView horizontal={true} style={{ flex: 1, flexDirection: 'row' }}>
                  {colors.map((color) => (
                    <TouchableOpacity
                      accessible={true}
                      accessibilityLabel={'hex code: ' + color}
                      accessibilityHint="Assigns Background Color"
                      key={color}
                      style={[{ borderWidth: 1, borderRadius: 50, borderColor: 'white' }, selectedColor === color && { borderColor: 'black' }]}
                      onPress={() => this.handleColorChange(color)}>
                      <View
                        style={[styles.colors, { backgroundColor: color }]}
                        key={color}>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    accessible={true}
                    accessibilityLabel="Enter Chat App"
                    accessibilityHint="Goes to Chat Page"
                    style={[styles.button, { backgroundColor: selectedColor }]} onPress={() => this.handleLogIn()} >
                    <Text style={{ color: defaultTextColor, fontSize: 16, fontWeight: 'bold' }}>Start Chatting</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    margin: 25,
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10
  },
  title: {
    fontWeight: 'bold',
    fontSize: 48,
    marginBottom: 30,
    color: '#313131'
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: 'auto',
    width: 'auto'
  },
  colors: {
    width: 44,
    height: 44,
    borderRadius: 44,
    margin: 10,
    borderWidth: 1,
    borderColor: 'black'
  },
  nameInput: {
    borderColor: 'gray',
    borderWidth: 2,
    width: 300,
    padding: 20,
    marginBottom: 10,
    borderRadius: 40
  },
  chooseText: {
    fontSize: 16,
    color: '#757083',
    fontWeight: 'bold'
  },
  button: {
    height: 75,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    marginTop: 10
  }
});
