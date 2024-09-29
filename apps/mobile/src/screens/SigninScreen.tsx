import React, { useState } from 'react';
import { Button, Image, Spinner, Center, Text, Modal } from 'native-base';
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
  const [modalOpen, setModalOpen] = useState(true);

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

      setModalOpen(false);
      await fetchUser(() => navigation.navigate('SignupSplash'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={modalOpen} size={'xl'}>
      <Modal.Content>
        <Modal.Header alignItems={'center'}>
          <Text fontSize={'4xl'} bold>
            Welcome!
          </Text>
        </Modal.Header>
        <Modal.Body alignItems={'center'}>
          <Text fontSize={'2xl'}>
            Sign in to access your personalized insights!
          </Text>
        </Modal.Body>
        <Modal.Footer>
          {loading ? (
            <Center flex={1}>
              <Spinner size="lg" />
            </Center>
          ) : (
            <Button
              flex={1}
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
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default SigninScreen;
