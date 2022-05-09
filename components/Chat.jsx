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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: 'white' }}>
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
        <View style={{ height: 84, backgroundColor: selectedColor }} />}
    </KeyboardAvoidingView>
  );
}
