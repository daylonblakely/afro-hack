import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

GoogleSignin.configure({
  offlineAccess: true,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_SIGN_IN_WEB_CLIENT_ID,
  //   iosClientId: '<replace with your iOS client ID>',
});

const Login = () => {
  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices();

      // Start the sign-in process
      const { data } = await GoogleSignin.signIn();

      if (!data) return;

      // Create a Firebase credential with the Google token
      const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);

      // Sign in to Firebase with the credential
      const userCredential = await auth().signInWithCredential(
        googleCredential
      );

      // User is now signed in with Firebase
      return userCredential;
    } catch (error) {
      console.error(error);
    }
  }

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
    } catch (error) {
      console.log('Error related to Google sign-in: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <GoogleSigninButton onPress={() => onGoogleButtonPress()} />
      <GoogleSigninButton onPress={() => signOut()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 150,
  },
});

export default Login;
