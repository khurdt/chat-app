import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      selectedColor: '#090C08',
      defaultTextColor: 'white',
      warningText: ''
    }
  }

  handleColorChange = (color) => {
    this.setState({ selectedColor: color, defaultTextColor: (color === '#B9C6AE' || color === '#8A95A5') ? 'black' : 'white' });
  }

  handleLogIn = () => {
    !(this.state.name === '') ?
      (this.setState({ warningText: '' }), this.alertMyText(this.state.name),
        this.props.navigation.navigate('Chat', { name: this.state.name, selectedColor: this.state.selectedColor, defaultTextColor: this.state.defaultTextColor }))
      : (this.setState({ warningText: 'please enter your name' }))
  }

  alertMyText(name) {
    Alert.alert('Welcome to Chatter ' + name);
  }

  render() {
    const { name, warningText, selectedColor, defaultTextColor } = this.state;
    const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE']
    return (
      <>
        <Image style={styles.backgroundImage} source={require('../assets/BackgroundImage.png')} />
        <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.title}>Chatter</Text>
        </View>
        <ScrollView>
          <View style={styles.container} >
            <View style={{ flex: 1 }}>
              <TextInput
                style={[styles.chooseText, styles.nameInput, { borderColor: selectedColor }]}
                onChangeText={(name) => this.setState({ name })}
                value={name}
                placeholder='Type your name...'
              />
            </View>
            <Text style={styles.chooseText}>Choose Background Color</Text>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              {colors.map((color) => (
                <TouchableOpacity
                  style={{ backgroundColor: color, width: 50, height: 50, borderRadius: 50, margin: 10 }}
                  key={color}
                  onPress={() => this.handleColorChange(color)}
                />
              ))}
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity style={[styles.button, { backgroundColor: selectedColor }]} onPress={() => this.handleLogIn()} >
                <Text style={{ color: defaultTextColor, fontSize: 16, fontWeight: 'bold' }}>Start Chatting</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'darkorange', position: 'relative', height: 20 }}>{warningText}</Text>
            </View>
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
