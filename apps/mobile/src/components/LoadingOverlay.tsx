import React from 'react';
import { VStack, Spinner, Text, Center, useColorMode } from 'native-base';

const LoadingOverlay = ({ message }: { message?: string }) => {
  const { colorMode } = useColorMode();

  return (
    <Center
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg={
        colorMode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'
      }
      zIndex={1}
    >
      <VStack space={4} justifyContent="center" alignItems="center">
        <Spinner size="2xl" color="primary.500" />
        {message ? (
          <Text fontSize="2xl" color="gray.500">
            {message}
          </Text>
        ) : null}
      </VStack>
    </Center>
  );
};

export default LoadingOverlay;
