import React, { useEffect, useState } from 'react';
import { VStack, Center, Text, Spinner, useColorMode } from 'native-base';
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/root-stack-param-list';
import { useSignupFlowConfigContext } from '../context/signup-config';

type Props = StackScreenProps<RootStackParamList, 'SignupSplash'>;

const SignupSplash = ({ navigation }: Props) => {
  const { colorMode } = useColorMode();
  const { fetchSignupFlowConfig } = useSignupFlowConfigContext();
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Automatically redirect to SignUp after fetching config and at least 2-second delay
  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      if (loadingComplete) {
        navigation.navigate('Signup');
      }
    }, 2000); // Ensure at least a 2-second delay

    return () => clearTimeout(redirectTimeout); // Clean up the timer
  }, [navigation, loadingComplete]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchSignupFlowConfig(); // Fetch config from the API
      setLoadingComplete(true);
    };

    fetchData();
  }, []);

  return (
    <Center flex={1} bg={colorMode === 'dark' ? 'black' : 'white'}>
      <VStack space={4} justifyContent="center" alignItems="center">
        {/* Loading Spinner */}
        <Spinner size="lg" color="primary.500" />

        {/* Informational Message */}
        <Text
          fontSize="xl"
          color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
        >
          Let's get you signed up!
        </Text>
      </VStack>
    </Center>
  );
};

export default SignupSplash;
