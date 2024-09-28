// SplashScreen.tsx
import React, { useEffect } from 'react';
import { Center, Spinner, Image, useColorMode, Text } from 'native-base';
import { theme } from '../app/theme';
// import AppLogo from '../path-to-your-logo'; // Replace with your logo import

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const { colorMode } = useColorMode();
  const bgColor = theme.backgroundColor[colorMode || 'dark'];

  useEffect(() => {
    // Simulate a delay for the splash screen (e.g., 2 seconds)
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);
    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, [onFinish]);

  return (
    <Center flex={1}>
      {/* <Image source={AppLogo} alt="App Logo" size="xl" /> */}
      <Text>splash</Text>
      <Spinner size="lg" mt={6} />
    </Center>
  );
};

export default SplashScreen;
