import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, Keyboard, LogBox } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { getDocs, onSnapshot, collection, query, orderBy, addDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Trash2 } from 'react-native-feather';
import { ScrollView } from 'react-native-gesture-handler';

export default function Chat(props) {
  const { uid, newColor, newName, newDefaultTextColor } = props.route.params;
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#090C08');
  const [defaultTextColor, setDefaultTextColor] = useState('white');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  //database collection from firebase
  const chatMessages = collection(db, 'Messages');

  useEffect(async () => {
    //setting navigation Bar options

    NetInfo.fetch().then(connection => {
      { connection.isConnected ? setIsConnected(true) : setIsConnected(false) }
    })
    if (newColor, newDefaultTextColor, newName) {
      setName(newName);
      setSelectedColor(newColor);
      setDefaultTextColor(newDefaultTextColor);
    }

    await getUserInfo();

    //filters chat messages for user's uid
    // const userMessages = query(chatMessages, where("uid", "==", uid));

    //orders messages by date showing most recent date
    const orderMessages = query(chatMessages, orderBy('createdAt', 'desc'));
    //snapshot function using orderMessages and calling onCollectionUpdate
    const unsuscribe = onSnapshot(orderMessages, onCollectionUpdate);

    return () => {
      //calling snapshot one time when component mounts or gets it locally
      { isConnected ? unsuscribe() : getMessagesLocally() };
    };

  }, [newColor, newName, newDefaultTextColor]);


  const getUserInfo = async () => {
    let name, selectedColor, defaultTextColor;

    try {
      name = await AsyncStorage.getItem('name');
      selectedColor = await AsyncStorage.getItem('selectedColor');
      defaultTextColor = await AsyncStorage.getItem('defaultTextColor')
    } catch (error) {
      console.log(error);
    }

    if (name !== null) {
      setName(name);
      setDefaultTextColor(defaultTextColor);
      setSelectedColor(selectedColor);
      props.navigation.setOptions({
        title: name,
        headerTintColor: selectedColor,
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center'
        },
      });
    }
  }

  const getMessagesLocally = async () => {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      setMessages(JSON.parse(messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  const saveMessagesLocally = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteMessagesLocally = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      setMessages([]);
    } catch (error) {
      console.log(error.message);
    }
  }

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
    ), () => {
      saveMessagesLocally();
    }
  }

  //sends message to firebase as a document in this format
  const addMessageToDataBase = (newMessage = []) => {
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
    setMessages(messages => {
      GiftedChat.append([...messages, message])
    }), () => {
      saveMessagesLocally();
    }
    // this.setState(previousState => ({ messages: GiftedChat.append(previousState.messages, message), }))
  }

  //edits chat input
  const renderInputToolbar = (props) => {
    if (isConnected === false) { } else {
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
      )
    }
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

  LogBox.ignoreLogs([
    "Setting a timer",
    "Warning: ...",
    "undefined",
    "Animated.event now requires a second argument for options",
    "Console Warning"
  ]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: 'white' }}>
      <GiftedChat
        renderAvatarOnTop={true}
        renderBubble={renderBubble.bind(this)}
        minInputToolbarHeight={50}
        renderInputToolbar={renderInputToolbar.bind(this)}
        messages={messages}
        onSend={(message) => { onSend(message); addMessageToDataBase(message) }}
        user={{
          _id: uid,
          name: name
        }}
        isTyping
        alwaysShowSend
        lightboxProps={{ useNativeDriver: true }}
        // onLoadEarlier={onLoadEarlierMessages}
        // isLoadingEarlier={isLoadingEarlier}
        // loadEarlier={messages.length >= 15 && messagePage <= messageLastPage}
        infiniteScroll
        isCustomViewBottom
        // renderActions={renderActions}
        // renderComposer={renderComposer}
        // renderSend={renderSend}
        isKeyboardInternallyHandled={false}
      />
      {Platform.OS === 'ios' &&
        <View style={{ height: 84, backgroundColor: selectedColor }}>
          <ScrollView horizontal={true} style={{ flex: 1, margin: 15, flexDirection: 'row' }}>
            <Trash2 stroke={defaultTextColor} fill={selectedColor} width={35} height={35}
              onPress={() => deleteMessagesLocally()}
            />
          </ScrollView>
        </View>
      }
    </KeyboardAvoidingView>
  );
}


