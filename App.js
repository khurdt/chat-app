import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import AssetExample from './components/AssetExample';
import { StatusBar } from 'expo-status-bar';

export default class HelloWorld extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
  }

  alertMyText(input = []) {
    Alert.alert(input.text);
  }

  render() {
    const { texts, text } = this.state;
    return (
      <View style={styles.container}>
        <View style={[styles.header]}>
          <View style={styles.box1} />
          <View style={styles.box2}>
            <Text style={styles.headerText}>Header</Text>
          </View>
          <View style={styles.box3} />
        </View>
        <View style={styles.body}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.setState({ text })}
              placeholder='type here...' />
            <Button style={{ fontSize: 20, width: 50, height: 50 }}
              onPress={() => { this.alertMyText({ text: this.state.input }) }}>
              Submit</Button>
          </View>
          <AssetExample />
          {/* {texts.map((text) => (<Text key={text}>{text}</Text>))} */}
        </View>
        <View style={[styles.header, styles.footer]}>
          <View style={styles.box2} />
          <View style={styles.box3}>
            <Text style={styles.headerText}>Footer</Text>
          </View>
          <View style={styles.box1} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  header: {
    flex: 0.1,
    flexDirection: 'row'
  },
  body: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: {
    flex: 0.1,
  },
  box1: {
    flex: 1,
    backgroundColor: 'red'
  },
  box2: {
    flex: 1,
    backgroundColor: 'blue'
  },
  box3: {
    flex: 1,
    backgroundColor: 'yellow'
  },
  headerText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: "-50%" },
      { translateY: "-50%" }
    ]
  },
  textInput: {
    flex: 0,
    borderColor: 'grey',
    borderWidth: 1,
    margin: 20,
    padding: 10
  }
})

