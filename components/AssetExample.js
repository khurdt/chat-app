import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  alertMyText(input = []) {
    Alert.alert(input.text);
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(text) => this.setState({ text })}
          value={this.state.text}
          placeholder='Type here ...'
        />
        <Text>You wrote: {this.state.text}</Text>
        <Button
          onPress={() => {
            this.alertMyText({ text: this.state.text });
          }}
          title="Press Me"
        />

      </View>
    );
  }
}
