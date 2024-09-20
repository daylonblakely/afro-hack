import React, { useEffect, useState, useRef } from 'react';
import { Dimensions, Animated } from 'react-native';
import { Box, useTheme, Text, useColorMode } from 'native-base';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  HandlerStateChangeEvent,
} from 'react-native-gesture-handler';

import { useUserContext } from '../context/user-context';
import Fab from '../components/Fab';
import { MenuIconProps } from '../components/MenuIcon';

const { height } = Dimensions.get('window');

const HomeScreen = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const { signOut } = useUserContext();
  const [quotes, setQuotes] = useState<string[]>([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // New animation values
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const theme = useTheme();

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
      const data = ['First Quote', 'Second Quote', 'Third Quote'];
      setQuotes(data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  // Animate quote transition
  const animateQuoteTransition = (direction: 'up' | 'down') => {
    // Animate the current quote out
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Change the quote after the current one fades out
      setCurrentQuoteIndex((prevIndex) =>
        direction === 'up'
          ? Math.min(prevIndex + 1, quotes.length - 1)
          : Math.max(prevIndex - 1, 0)
      );

      // Animate the new quote in
      translateY.setValue(direction === 'up' ? height : -height);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // Handle vertical swipe
  const handleSwipe = (
    event: HandlerStateChangeEvent<Record<string, unknown>>
  ) => {
    const { translationY } = event.nativeEvent;

    if (
      (translationY as number) < -height / 6 &&
      currentQuoteIndex < quotes.length - 1
    ) {
      animateQuoteTransition('up');
    } else if ((translationY as number) > height / 6 && currentQuoteIndex > 0) {
      animateQuoteTransition('down');
    } else {
      // Animate back to center if swipe is not enough
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* App Title at the Top */}
      <Box safeAreaTop alignItems="center">
        <Text fontSize="2xl" fontWeight="bold">
          QuoteApp
        </Text>
      </Box>

      {/* Swipeable quote box */}
      <PanGestureHandler onGestureEvent={onGestureEvent} onEnded={handleSwipe}>
        <Animated.View
          style={{
            transform: [{ translateY }],
            opacity,
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            px={5}
            py={8}
            rounded="lg"
            borderWidth={1}
            maxWidth="90%"
            borderColor={theme.colors.primary[500]}
            alignItems="center"
          >
            <Text fontSize="lg" fontStyle="italic" textAlign="center">
              {quotes.length > 0
                ? quotes[currentQuoteIndex]
                : 'Loading quotes...'}
            </Text>
          </Box>
        </Animated.View>
      </PanGestureHandler>

      {/* Floating Action Button */}
      <Fab menuIcons={menuIcons} />
    </GestureHandlerRootView>
  );
};

export default HomeScreen;
