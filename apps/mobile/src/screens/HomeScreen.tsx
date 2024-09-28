import React, { useEffect } from 'react';
import { useColorMode, Box, Text } from 'native-base';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useUserContext } from '../context/user-context';
import VerticalFeed from '../components/VerticalFeed';
import Fab from '../components/Fab';
import { MenuIconProps } from '../components/MenuIcon';
import { useLoadingContext } from '../context/loading-context';
import { useFlashCardContext } from '../context/flash-card-context';
import { TITLE } from '../app/config';

const HomeScreen = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const {
    actions: { signOut },
  } = useUserContext();
  const {
    actions: { setIsLoading },
  } = useLoadingContext();
  const {
    state: cards,
    actions: { getFlashCards },
  } = useFlashCardContext();

  const menuIcons: MenuIconProps[] = [
    {
      bg: 'secondary.400',
      icon: 'dark-mode',
      text: colorMode === 'dark' ? 'Light Mode' : 'Dark Mode',
      onPress: toggleColorMode,
      disabled: false,
    },
    {
      bg: 'yellow.400',
      icon: 'logout',
      text: 'Sign Out',
      onPress: signOut,
      disabled: false,
    },
  ];

  // Fetching the quotes from an API
  useEffect(() => {
    setIsLoading(true, 'Fetching Your Daily Info...');
    getFlashCards(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* App Title at the Top */}
      <Box safeAreaTop alignItems="center" position={'absolute'} mt={4} ml={8}>
        <Text fontSize="4xl" bold color={'white'}>
          {TITLE}
        </Text>
      </Box>

      {/* Swipeable quote box */}
      {cards.length ? <VerticalFeed items={cards} /> : null}

      {/* Floating Action Button */}
      <Fab menuIcons={menuIcons} />
    </GestureHandlerRootView>
  );
};

export default HomeScreen;
