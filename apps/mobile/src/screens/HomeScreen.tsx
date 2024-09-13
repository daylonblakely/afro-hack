import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import server from '../api/server';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const HomeScreen = () => {
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
    } catch (error) {
      console.log('Error related to Google sign-in: ', error);
    }
  };

  return (
    <View>
      <Text>Screen</Text>
      <TouchableOpacity
        onPress={() => {
          server
            .get('/auth/currentUser')
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.error('Error fetching data:', error);
            });
        }}
      >
        <Text>protected</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => signOut()}>
        <Text>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
