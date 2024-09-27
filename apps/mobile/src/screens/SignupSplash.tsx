import React, { useEffect, useState } from 'react';
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/root-stack-param-list';
import { useSignupFlowConfigContext } from '../context/signup-config';
import LoadingOverlay from '../components/LoadingOverlay';

type Props = StackScreenProps<RootStackParamList, 'SignupSplash'>;

const SignupSplash = ({ navigation }: Props) => {
  const {
    actions: { fetchSignupFlowConfig },
  } = useSignupFlowConfigContext();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <LoadingOverlay message="Let's get you signed up!" />;
};

export default SignupSplash;
