import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Image } from 'react-native';
import { Audio } from 'expo-av';


export default function RecordingSound() {
  const [sound, setSound] = useState();
  const [recording, setRecording] = useState();


  useEffect(async () => {
    return sound ? () => {
      sound.unloadAsync();
    }
      : undefined;

  }, [sound]);

  const playSound = async () => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.createAsync(require('./assets/sounds/Hello.mp3'));
      await soundObject.playAsync();
    } catch (error) {
      console.log(error)
    }
    setSound(soundObject);
  }

  const startRecording = async = () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (error) {
      console.log('failed to start recording', error)
    }
  }

  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
  }



  return (
    <View style={styles.container}>
      <Button
        title='Play Sound'
        onPress={playSound}
      />
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});