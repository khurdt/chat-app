import React from 'react';
import { StyleSheet, View, Text, TextInput, Alert, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.route.params.name,
      selectedColor: this.props.route.params.selectedColor,
      defaultTextColor: this.props.route.params.defaultTextColor,
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
      this.props.navigation.navigate('ChatStackScreen', {
        screen: 'Chat',
        params: {
          name: this.state.name,
          selectedColor: this.state.selectedColor,
          defaultTextColor: this.state.defaultTextColor,
          uid: this.state.uid
        }
      }))
      :
      this.noNameAlert();
  }

  noNameAlert() {
    Alert.alert('please enter a name');
  }

  render() {
    const { name, warningText, selectedColor, defaultTextColor } = this.state;
    const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080', '#800000', '#808000', '#008000', '#800080', '#008080', '#000080']

    return (
      <View style={styles.container} >
        <ScrollView>
          <KeyboardAvoidingView behavior='height'>
            <View style={{ flex: 4 }}>
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
            <View style={{ flex: 3 }}>
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
            <View style={{ flex: 8 }}></View>
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
        </ScrollView>
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
    padding: 25,
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