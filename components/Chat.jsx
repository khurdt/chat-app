import React from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

const firebase = require('firebase');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDRKQsEWdo-TnHBDaxYUBVF04uySLgM5kE",
  authDomain: "chat-app-54ecd.firebaseapp.com",
  projectId: "chat-app-54ecd",
  storageBucket: "chat-app-54ecd.appspot.com",
  messagingSenderId: "690320710091",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    }
  }

  //static messages
  componentDidMount() {
    this.referenceChatApp = firebase.firestore().collection('Messages');
    this.unsubscribe = this.referenceChatApp.onSnapshot(this.onCollectionUpdate);
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: this.props.route.params.name + ' has entered the chat',
          createdAt: new Date(),
          system: true,
        },
      ],
    })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    //go through each document
    querySnapshot.forEach((doc) => {
      //get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });
    });
    this.setState({ messages });
  };

  //allows customization just to message bubble
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: this.props.route.params.selectedColor,
          }
        }}
        textProps={{
          style: {
            color: props.position === 'left' ? '#000' : this.props.route.params.defaultTextColor,
          },
        }}
        textStyle={{
          left: {
            color: '#000',
          },
          right: {
            color: this.props.route.params.defaultTextColor,
          },
        }}
        timeTextStyle={{
          left: {
            color: 'black',
          },
          right: {
            color: this.props.route.params.defaultTextColor,
          },
        }}
      />
    )
  }

  //to send text to messages array
  onSend(messages = []) {
    this.setState(previousState => ({ messages: GiftedChat.append(previousState.messages, messages), }))
  }

  render() {
    const { name, selectedColor, defaultTextColor } = this.props.route.params;
    const { messages } = this.state;

    return (
      <>
        <View style={{ flex: 1 }} {...Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null} >
          <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            messages={messages}
            onSend={(messages) => this.onSend(messages)}
            user={{
              _id: 1,
            }}
          />
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

{/* <ScrollView style={{ flex: 12 }}>
            {texts.map((text) => (
              <Text style={{ color: defaultTextColor, fontSize: 16, fontWeight: 'bold' }}>{text}</Text>))}
          </ScrollView> */}

{/* <View style={{ flex: 0.1, backgroundColor: 'white', position: 'absolute', left: 0, right: 0, bottom: 0 }}>
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
          </View> */}