import React, { useState } from 'react';
import { VStack, Button, Image, Spinner, Center, Text } from 'native-base';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/root-stack-param-list';
import { useUserContext } from '../context/user-context';
import { storeUser } from '../app/async-storage';

type Props = StackScreenProps<RootStackParamList, 'SignIn'>;

const SigninScreen = ({ navigation }: Props) => {
  const {
    actions: { fetchUser },
  } = useUserContext();
  const [loading, setLoading] = useState(false);

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

      await storeUser(data.idToken as string);

      await fetchUser(() => navigation.navigate('SignupSplash'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <VStack flex={1} padding={4} justifyContent="center" alignItems="center">
      {/* Google Sign In Button at the bottom */}
      {loading ? (
        <Center position="absolute" bottom={4}>
          <Spinner size="lg" />
        </Center>
      ) : (
        <Button
          position="absolute"
          bottom={4}
          width="90%"
          onPress={onGoogleButtonPress}
          variant={'onBg'}
          borderWidth={2}
          borderColor={'primary.500'}
          borderRadius={20}
          leftIcon={
            <Image
              source={require('../../assets/google_logo.png')}
              alt="Google"
              size="xs"
            />
          }
        >
          <Text fontSize={'xl'}>Sign in with Google</Text>
        </Button>
      )}
    </VStack>
  );
};

export default SigninScreen;
