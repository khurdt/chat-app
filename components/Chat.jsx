import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      texts: ['hello world!']
    }
  }

  render() {
    const { name, selectedColor, defaultTextColor } = this.props.route.params;
    const { text, texts } = this.state;

    this.props.navigation.setOptions({ title: name })
    return (
      <>
        <Image style={styles.backgroundImage} source={require('../assets/BackgroundImage.png')} />
        <View style={[styles.container, { backgroundColor: selectedColor }]} >
          <ScrollView style={{ flex: 12 }}>
            {texts.map((text) => (
              <Text style={{ color: defaultTextColor, fontSize: 16, fontWeight: 'bold' }}>{text}</Text>))}
          </ScrollView>
          <View style={{ flex: 0.1 }}>
            <TextInput
              style={[styles.chooseText, styles.nameInput, { borderColor: defaultTextColor }]}
              onChangeText={(text) => this.setState({ text })}
              value={text}
              placeholder='Send Message...'
            />
          </View>
          <TouchableOpacity style={[styles.button, { backgroundColor: defaultTextColor }]} onPress={() => this.setState(previousState => ({ texts: [...previousState.texts, text] }))} >
            <Text style={{ color: selectedColor, fontSize: 16, fontWeight: 'bold' }}>Send</Text>
          </TouchableOpacity>
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
    flex: 1
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  nameInput: {
    borderColor: 'gray',
    borderWidth: 2,
    width: 350,
    padding: 10,
    paddingRight: 60,
    borderRadius: 40
  },
  chooseText: {
    fontSize: 16,
    color: '#757083',
    fontWeight: 'bold'
  },
  button: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginBottom: 39,
    marginRight: 8,
    height: 43,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40
  }
});