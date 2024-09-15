import React, { useState } from 'react';
import { VStack, Button, Image, Spinner, Center, Text } from 'native-base';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/root-stack-param-list'; // Import RootStackParamList

type SignInScreenNavigationProp = NavigationProp<RootStackParamList, 'SignIn'>;

const SigninScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<SignInScreenNavigationProp>();

  async function onGoogleButtonPress() {
    setLoading(true);

    try {
      await GoogleSignin.hasPlayServices();
      const { data } = await GoogleSignin.signIn();
      if (!data) throw new Error('Google Sign-In failed');

      const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential
      );
      const user = userCredential.user;
      if (!user) throw new Error('Failed to get user');

      // const response = await axios.post(
      //   'https://your-api-url.com/check-user-profile',
      //   {
      //     uid: user.uid,
      //   }
      // );

      // if (response.data.hasProfile) {
      //   navigation.navigate('Home');
      // } else {
      //   navigation.navigate('Signup');
      // }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <VStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding={4}
      bg="white"
    >
      {/* <Image
        source={{ uri: 'https://example.com/logo.png' }} // Replace with your logo URI
        alt="App Logo"
        size="xl"
        marginBottom={8}
      /> */}

      {loading ? (
        <Center>
          <Spinner size="lg" />
          <Text>Signing in...</Text>
        </Center>
      ) : (
        <GoogleSigninButton
          onPress={onGoogleButtonPress}
          size={GoogleSigninButton.Size.Wide}
        />
      )}

      <Button marginTop={4} onPress={() => console.log('Toggle theme')}>
        Toggle Dark/Light Mode
      </Button>
    </VStack>
  );
};

export default SigninScreen;
