import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { getDocs, onSnapshot, collection, query, orderBy, addDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Chat(props) {
  const { name, selectedColor, defaultTextColor } = props.route.params;

  const [messages, setMessages] = useState([]);

  const [uid, setUid] = useState(0);

  const chatMessages = collection(db, 'Messages');

  // create a reference to the active user's documents (messages)
  // const userMessages = chatMessages.where('uid', '==', uid);

  useEffect(() => {
    props.navigation.setOptions({ title: name });

    const orderMessages = query(chatMessages, orderBy('createdAt', 'desc'));

    onAuthStateChanged(auth, user => {
      if (!user) {
        auth.signInAnonymously();
      } else {
        setUid(user.uid);
      }
    })

    const unsuscribe = onSnapshot(orderMessages, onCollectionUpdate);

    return () => { unsuscribe(); }

  }, []);

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

  const addMessage = (newMessage = []) => {
    addDoc(chatMessages, {
      uid: uid,
      _id: newMessage[0]._id,
      text: newMessage[0].text,
      createdAt: newMessage[0].createdAt,
      user: newMessage[0].user,
    })
  }

  //allows customization just to message bubble
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
            color: props.position === 'left' ? '#000' : defaultTextColor,
          },
        }}
        textStyle={{
          left: {
            color: '#000',
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

  //to send text to messages array
  const onSend = (message = []) => {
    setMessages(messages => { GiftedChat.append([...messages, message]) });
    // this.setState(previousState => ({ messages: GiftedChat.append(previousState.messages, message), }))
  }

  return (
    <>
      <View style={{ flex: 1 }} {...Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null} >
        <GiftedChat
          renderBubble={renderBubble.bind(this)}
          messages={messages}
          onSend={(message) => { onSend(message); addMessage(message) }}
          user={{
            _id: uid,
            name: name,
            avatar: 'https://placeimg.com/140/140/any'
          }}
        />
      </View>
    </>
  );
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