import React, { useEffect } from 'react';
import { VStack, Center, Text, Spinner, useColorMode } from 'native-base';
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/root-stack-param-list';

type Props = StackScreenProps<RootStackParamList, 'SignupSplash'>;

const SignupSplash = ({ navigation }: Props) => {
  const { colorMode } = useColorMode();

  // Automatically redirect to SignUp after a short delay
  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      navigation.navigate('Signup');
    }, 2000); // 2-second delay

    return () => clearTimeout(redirectTimeout); // Clean up the timer
  }, [navigation]);

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
