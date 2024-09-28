import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import {
  VStack,
  Button,
  Image,
  Spinner,
  Center,
  Text,
  Circle,
  HStack,
  Box,
} from 'native-base';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/root-stack-param-list';
import { useUserContext } from '../context/user-context';
import { storeUser } from '../app/async-storage';
import { TITLE } from '../app/config';

type Props = StackScreenProps<RootStackParamList, 'SignIn'>;

const SigninScreen = ({ navigation }: Props) => {
  const {
    actions: { fetchUser },
  } = useUserContext();
  const [loading, setLoading] = useState(false);
  const screenHeight = Dimensions.get('window').height;

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

  const titleArray = '<,B,a,c,k,e,n,d,/>'.split(',');

  return (
    <VStack flex={1} padding={4} justifyContent="center" alignItems="center">
      {/* Logo in the center */}
      <VStack flexGrow={1} justifyContent={'space-around'} paddingBottom={36}>
        <Circle
          size="lg"
          // bg="white"
          borderColor={'white'}
          borderWidth={2}
          alignSelf={'flex-end'}
          left={16}
        >
          {/* Replace 'Logo' with your actual Image component */}
          {/* <Box flexWrap={'wrap'} alignSelf={'flex-end'} width={'40%'}> */}
          <Text color="white" fontSize="xl" bold>
            "Learn"
          </Text>
          {/* </Box> */}
        </Circle>
        <Circle size="2xl" bg="primary.400">
          {/* Replace 'Logo' with your actual Image component */}
          <Text color="white" fontSize="2xl">
            Logo
          </Text>
        </Circle>
        <Circle size="lg" bg="secondary.400" alignSelf={'flex-end'}>
          {/* Replace 'Logo' with your actual Image component */}
          <Text color="white" fontSize="2xl">
            Logo
          </Text>
        </Circle>
      </VStack>

      {/* display vertically */}
      <Center position="absolute" flexGrow={1} left={4} top={8}>
        {titleArray.map((letter, index) => (
          <Text
            key={index}
            fontSize={'5xl'}
            fontWeight="bold"
            color={'primary.300'}
          >
            {letter}
          </Text>
        ))}
      </Center>

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
