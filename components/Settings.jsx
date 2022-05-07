import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.route.params.name,
      selectedColor: this.props.route.params.selectedColor,
      defaultTextColor: this.props.route.params.defaultTextColor,
      warningText: '',
      lightColors: ['#8A95A5', '#B9C6AE', '#00FF00', '#FFFF00', '#00FFFF', '#C0C0C0'],
      uid: this.props.route.params.uid
    }
  }

  //changes current color and text color depending on if color is light or dark
  handleColorChange = (color) => {
    this.setState({ selectedColor: color, defaultTextColor: (this.state.lightColors.includes(color)) ? 'black' : 'white' });
  }
  //navigates to chat page if name is provided
  handleSettingsChange = () => {
    (this.state.name !== '') ? (
      // this.alertMyText(),
      this.props.navigation.navigate('Chat', {
        name: this.state.name,
        selectedColor: this.state.selectedColor,
        defaultTextColor: this.state.defaultTextColor,
        uid: this.state.uid
      }))
      :
      this.setState({ warningText: 'please enter your name' });
  }

  // alertMyText() {
  //   Alert.alert('Welcome ' + this.state.name);
  // }

  render() {
    const { name, warningText, selectedColor, defaultTextColor } = this.state;
    const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080', '#800000', '#808000', '#008000', '#800080', '#008080', '#000080']

    return (
      <>
        <ScrollView>
          <View style={styles.container} >
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='height' >
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
                  style={[styles.button, { backgroundColor: selectedColor }]} onPress={() => this.handleSettingsChange()} >
                  <Text style={{ color: defaultTextColor, fontSize: 16, fontWeight: 'bold' }}>Save and Chat</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: 'darkorange', position: 'relative', height: 20 }}>{warningText}</Text>
              </View>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
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
    padding: 25,
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