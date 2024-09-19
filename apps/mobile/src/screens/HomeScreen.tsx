import React, { useEffect, useState } from 'react';
import { Dimensions, Animated } from 'react-native';
import {
  Box,
  Fab,
  Icon,
  useTheme,
  Text,
  Button,
  Stagger,
  Modal,
  useDisclose,
  useColorMode,
} from 'native-base';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  HandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { useUserContext } from '../context/user-context';

const { height } = Dimensions.get('window');

const QuoteScreen = () => {
  const { toggleColorMode } = useColorMode();
  const { signOut } = useUserContext();
  const [quotes, setQuotes] = useState<string[]>([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const { isOpen, onToggle } = useDisclose();
  const theme = useTheme();
  const translateY = new Animated.Value(0);

  // Fetching the quotes from an API
  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      //   const response = await fetch('https://api.example.com/quotes');
      //   const data = await response.json();
      const data = ['ahhahahahah', 'what the fuuuuuuuuck'];
      setQuotes(data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
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
      setCurrentQuoteIndex((prev) => prev + 1);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else if ((translationY as number) > height / 6 && currentQuoteIndex > 0) {
      setCurrentQuoteIndex((prev) => prev - 1);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
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
      <Fab
        position="absolute"
        size="sm"
        icon={<Icon as={MaterialIcons} name="menu" />}
        placement="bottom-right"
        bg={theme.colors.secondary[500]}
        onPress={onToggle}
      ></Fab>
      <Modal isOpen={isOpen} onClose={onToggle}>
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
          <Box position="absolute" bottom={16} right={4} flexDirection="column">
            <Button
              bg={theme.colors.primary[500]}
              leftIcon={<Icon as={MaterialIcons} name="share" size="sm" />}
              onPress={() => console.log('Share')}
            >
              Share
            </Button>
            <Button marginTop={4} onPress={signOut}>
              Sign out
            </Button>
            <Button marginTop={4} onPress={toggleColorMode}>
              Toggle Dark/Light Mode
            </Button>
          </Box>
        </Stagger>
      </Modal>
    </GestureHandlerRootView>
  );
};

export default QuoteScreen;
