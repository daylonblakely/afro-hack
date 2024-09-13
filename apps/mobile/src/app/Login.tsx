import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  offlineAccess: true,
  webClientId: process.env.GOOGLE_SIGN_IN_WEB_CLIENT_ID,
  //   iosClientId: '<replace with your iOS client ID>',
});

const Login = () => {
  const testGoogleLoginFunctionality = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      // log in using Google account (on Android it will only work if google play services are installed)
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);

      // try to sign in silently (this should be done when the user is already signed-in)
      /*
        const userInfo2 = await GoogleSignin.signInSilently();
        console.log(userInfo2);
      */

      // to logout use the following piece of code
      /*
      const resp = await GoogleSignin.signOut();
      console.log(resp);
      */
    } catch (error) {
      if (error) {
        console.log('Error related to Google sign-in: ', error);
      } else {
        console.log('An error that is not related to Google sign-in: ', error);
      }
    }
  };

  const signOut = async () => {
    try {
      const resp = await GoogleSignin.signOut();
      console.log(resp);
    } catch (error) {
      console.log('Error related to Google sign-in: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <GoogleSigninButton onPress={() => testGoogleLoginFunctionality()} />
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
