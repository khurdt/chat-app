import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { storage } from '../config/firebase';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';

import { Image, Aperture, MapPin } from 'react-native-feather';

export default class CustomActions extends React.Component {

  onActionsPress = async () => {
    const options = [
      `Choose From Library`,
      'Take Picture',
      'Send My Location',
      'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return this.pickImage();
          case 1:
            console.log('user wants to take a photo');
            return this.takePhoto();
          case 2:
            console.log('user wants to get their location');
            return this.getLocation();
          default:
        }
      },
    );
  };

  pickImage = async () => {
    //getting permissions
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
      }).catch(error => console.log(error));

      if (!result.cancelled) {
        //getting binary blob for firebase storage
        const blob = await this.getBlob(result.uri)
        //getting download URL for firebase database
        const imageUrl = await this.uploadImage(blob);
        //sending image and updating database
        this.props.onSend({ image: imageUrl });
      }
    }
  }

  takePhoto = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'Images',
      }).catch(error => console.log(error));

      if (!result.cancelled) {
        const blob = await this.getBlob(result.uri)
        const imageUrl = await this.uploadImage(blob);
        this.props.onSend({ image: imageUrl });
      }
    }
  }

  getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    try {
      this.props.setAlert('getting location');
      this.props.handleAnimation(8000)
      if (status === "granted") {
        let result = await Location.getCurrentPositionAsync({}).catch((error) => {
          console.error(error);
        }
        );
        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
        this.props.setAlert('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  getBlob = async (uri) => {
    //creating binary large object from uri
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    //getting name of image
    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    //returning both name and blob
    const file = {
      name: imageName,
      blob: blob
    }
    return file;
    // return await uploadTask.ref.getDownloadURL();
  };

  uploadImage = async (file) => {
    //set or get storage location from imported storage function from config file
    const imageRef = ref(storage, `images/${file.name}`);
    //uploading blob to storage location 
    const snapshot = await uploadBytes(imageRef, file.blob);
    //getting downloadUrl for database
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return downloadUrl;
  };

  render() {
    return (
      <TouchableOpacity
        style={[styles.container]}
        onPress={this.onActionsPress}
        accessible={true}
        accessibilityLabel='More options'
        accessibilityHint='Lets you choose to send an image or your geolocation'
      >
        <View style={[styles.wrapper]}>
          <Text style={[styles.iconText]}>
            +
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 12,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  }
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};