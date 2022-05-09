import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, Keyboard } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { getDocs, onSnapshot, collection, query, orderBy, addDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase';


export default function Chat(props) {
  const { name, selectedColor, defaultTextColor, uid } = props.route.params;

  const [messages, setMessages] = useState([]);

  //database collection from firebase
  const chatMessages = collection(db, 'Messages');

  useEffect(() => {
    //setting navigation Bar options
    props.navigation.setOptions({
      title: name,
      headerTintColor: selectedColor,
      headerTitleStyle: {
        fontWeight: 'bold',
        textAlign: 'center'
      },
    });
    //filters chat messages for user's uid
    const userMessages = query(chatMessages, where("uid", "==", uid));
    //orders messages by date showing most recent date
    const orderMessages = query(userMessages, orderBy('createdAt', 'desc'));
    //snapshot function using orderMessages and calling onCollectionUpdate
    const unsuscribe = onSnapshot(orderMessages, onCollectionUpdate);

    return () => {
      //calling snapshot one time when component mounts
      unsuscribe();
    };

  }, []);

  //sets messages array by mapping through all documents from the snapshot from firebase
  const onCollectionUpdate = (querySnapshot) => {
    setMessages(
      //go through each document
      querySnapshot.docs.map(doc => ({
        //get the QueryDocumentSnapshot's data
        _id: doc.data()._id,
        text: doc.data().text,
        createdAt: doc.data().createdAt.toDate(),
        user: doc.data().user
      }))
    )
  }

  //sends message to firebase as a document in this format
  const addMessage = (newMessage = []) => {
    addDoc(chatMessages, {
      uid: uid,
      _id: newMessage[0]._id,
      text: newMessage[0].text,
      createdAt: newMessage[0].createdAt,
      user: newMessage[0].user,
    })
  }

  //to send text to messages array
  const onSend = (message = []) => {
    setMessages(messages => { GiftedChat.append([...messages, message]) });
    Keyboard.dismiss();
    // this.setState(previousState => ({ messages: GiftedChat.append(previousState.messages, message), }))
  }

  //edits chat input
  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        style={{ color: defaultTextColor }}
        containerStyle={{
          paddingTop: 4,
          borderRadius: 100,
        }}
        textStyle={{
          color: selectedColor,
          paddingBottom: 5
        }}
      />
    );
  };

  //edits text bubbles
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: selectedColor,
          }
        }}
        textProps={{
          style: {
            color: props.position === 'left' ? 'black' : defaultTextColor,
          },
        }}
        textStyle={{
          left: {
            color: 'black',
          },
          right: {
            color: defaultTextColor,
          },
        }}
        timeTextStyle={{
          left: {
            color: 'black',
          },
          right: {
            color: defaultTextColor,
          },
        }}
      />
    )
  }

  return (
    <>
      <View style={{ flex: 1 }} >
        <GiftedChat
          renderBubble={renderBubble.bind(this)}
          minInputToolbarHeight={50}
          renderInputToolbar={renderInputToolbar.bind(this)}
          messages={messages}
          onSend={(message) => { onSend(message); addMessage(message) }}
          user={{
            _id: uid,
            name: name
          }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior={'position'} /> : null}
      </View>
    </>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//     flex: 1
//   },
//   nameInput: {
//     borderColor: 'gray',
//     borderWidth: 2,
//     width: 350,
//     padding: 10,
//     paddingRight: 60,
//     borderRadius: 40
//   },
//   chooseText: {
//     fontSize: 16,
//     color: '#757083',
//     fontWeight: 'bold'
//   },
//   button: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     marginBottom: 39,
//     marginRight: 8,
//     height: 43,
//     width: 50,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 40
//   }
// });

// this.setState({
//   messages: [
//     {
//       _id: 1,
//       text: 'Hello developer',
//       createdAt: new Date(),
//       user: {
//         _id: 2,
//         name: 'React Native',
//         avatar: 'https://placeimg.com/140/140/any',
//       },
//     },
//     {
//       _id: 2,
//       text: this.props.route.params.name + ' has entered the chat',
//       createdAt: new Date(),
//       system: true,
//     },
//   ],
// })

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