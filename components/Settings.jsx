import React from 'react';
import { StyleSheet, View, Text, TextInput, Alert, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      selectedColor: '#090C08',
      defaultTextColor: 'white',
      lightColors: ['#8A95A5', '#B9C6AE', '#00FF00', '#FFFF00', '#00FFFF', '#C0C0C0'],
    }
  }

  componentDidMount() {
    this.getUserInfo();
  }

  async getUserInfo() {
    let name, selectedColor, defaultTextColor;

    try {
      name = await AsyncStorage.getItem('name');
      selectedColor = await AsyncStorage.getItem('selectedColor');
      defaultTextColor = await AsyncStorage.getItem('defaultTextColor')
    } catch (error) {
      console.log(error);
    }

    if (name !== null) {
      this.setState({
        name: name,
        selectedColor: selectedColor,
        defaultTextColor: defaultTextColor
      })
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

  //navigates to chat page if name is provided
  handleSettingsChange = async () => {
    (this.state.name === '') ?
      this.noNameAlert()
      :
      await this.saveUserInfo();
    this.props.navigation.navigate('Chat', {
      newName: this.state.name,
      newColor: this.state.selectedColor,
      newDefaultTextColor: this.state.defaultTextColor
    })
  }

  noNameAlert() {
    Alert.alert('please enter a name');
  }

  render() {
    const { name, warningText, selectedColor, defaultTextColor } = this.state;
    const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE', '#FF0000', '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080', '#800000', '#808000', '#008000', '#800080', '#008080', '#000080']

    return (
      <View style={styles.container} >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior='positon'>
          <View style={{ flex: 1, minHeight: 100, marginBottom: 30 }}>
            <Text style={[styles.chooseText]}>Your Name:</Text>
            <TextInput
              accessible={true}
              accessibilityLabel='input for name'
              style={[styles.chooseText, styles.nameInput, { borderColor: selectedColor }]}
              onChangeText={(name) => this.setState({ name })}
              value={name}
              placeholder='Type your name...'
            />
          </View>
          <View style={{ minHeight: 100 }}>
            <Text style={styles.chooseText}>Choose Background Color</Text>
            <ScrollView horizontal={true} style={{ flex: 2, flexDirection: 'row' }}>
              {colors.map((color) => (
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel={'hex code: ' + color}
                  accessibilityHint="Assigns Background Color"
                  key={color}
                  style={[{ borderWidth: 1, borderRadius: 50, borderColor: 'white', height: 66, margin: 1 }, selectedColor === color && { borderColor: 'black' }]}
                  onPress={() => this.handleColorChange(color)}>
                  <View
                    style={[styles.colors, { backgroundColor: color }]}
                    key={color}>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={{ flex: 9 }}></View>
          <View style={{ flex: 4 }}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Enter Chat App"
              accessibilityHint="Goes to Chat Page"
              style={[styles.button, { backgroundColor: selectedColor }]} onPress={() => this.handleSettingsChange()} >
              <Text style={{ color: defaultTextColor, fontSize: 16, fontWeight: 'bold' }}>Save and Chat</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    margin: 25,
    marginTop: 50,
    width: 'auto',
    height: 'auto',
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
    borderRadius: 40,
    marginTop: 20
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