import React, { useEffect, useState } from 'react';
import { Box, Text, useColorMode } from 'native-base';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useUserContext } from '../context/user-context';
import VerticalFeed from '../components/VerticalFeed';
import Fab from '../components/Fab';
import { MenuIconProps } from '../components/MenuIcon';
import { useLoadingContext } from '../context/loading-context';

const HomeScreen = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const { signOut } = useUserContext();
  const { setIsLoading } = useLoadingContext();
  const [quotes, setQuotes] = useState<string[]>([]);

  const menuIcons: MenuIconProps[] = [
    {
      bg: 'red.400',
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
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setIsLoading(true);
      await new Promise((f) => setTimeout(f, 3000));
      const data = ['First Quote', 'Second Quote', 'Third Quote'];
      setQuotes(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* App Title at the Top */}
      <Box safeAreaTop alignItems="center">
        <Text fontSize="2xl" fontWeight="bold">
          QuoteApp
        </Text>
      </Box>

      {/* Swipeable quote box */}
      {quotes.length ? <VerticalFeed items={quotes} /> : null}

      {/* Floating Action Button */}
      <Fab menuIcons={menuIcons} />
    </GestureHandlerRootView>
  );
};

export default HomeScreen;
