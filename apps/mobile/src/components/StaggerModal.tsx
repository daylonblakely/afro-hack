import React from 'react';
import {
  Stagger,
  Modal,
  useColorMode,
  VStack,
  Center,
  Text,
  HStack,
  Divider,
} from 'native-base';
import { TITLE } from '../app/config';

interface StaggerModalProps {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const StaggerModal = ({ isOpen, onToggle, children }: StaggerModalProps) => {
  const { colorMode } = useColorMode();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onToggle}
      bg={
        colorMode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)'
      }
    >
      <VStack flex={1} padding={4}>
        <Center flexGrow={2}>
          <Text fontSize={'2xl'} textAlign={'center'} fontWeight={'semibold'}>
            Welcome to{' '}
            <Text
              color={colorMode === 'dark' ? 'primary.400' : 'primary.600'}
              bold
            >
              {TITLE}
            </Text>
            {'. '}
            Your personalized hub for uplifting and tailored insights on
            leveling up in the tech industry. Whether you're looking for
            motivation or guidance on your career journey, we're here to inspire
            and empower you every step of the way. Let's start building your
            future together!
          </Text>
          <Divider mt={4} />
          <Text fontSize={'xl'} mt={4} fontWeight={'medium'}>
            <Text
              color={colorMode === 'dark' ? 'primary.400' : 'primary.600'}
              bold
            >
              Swipe
            </Text>{' '}
            and{' '}
            <Text
              color={colorMode === 'dark' ? 'secondary.300' : 'secondary.400'}
              bold
            >
              double tap
            </Text>{' '}
            cards to get started. Your personalized insights will be updated
            daily.
          </Text>
        </Center>
        <Center>
          <Stagger
            visible={isOpen}
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: {
                type: 'spring',
                mass: 0.8,
                stiffness: 100,
                stagger: {
                  offset: 30,
                  reverse: true,
                },
              },
            }}
          >
            <HStack space={4}>{children}</HStack>
          </Stagger>
        </Center>
      </VStack>
    </Modal>
  );
};

export default StaggerModal;
