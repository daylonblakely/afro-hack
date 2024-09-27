import React, { useState, useRef } from 'react';
import { Dimensions, Animated } from 'react-native';
import {
  PanGestureHandler,
  HandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import { IPrompt } from '@afro-hack/types';
import FlipCard from './FlipCard';
import { Box, VStack, useTheme, useColorMode } from 'native-base';

const { height } = Dimensions.get('window');

interface VerticalFeedProps {
  items: IPrompt[];
}

const VerticalFeed = ({ items }: VerticalFeedProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const theme = useTheme(); // Accessing NativeBase theme for color mode
  const { colorMode } = useColorMode();

  const animateTransition = (direction: 'up' | 'down') => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prevIndex) =>
        direction === 'up'
          ? Math.min(prevIndex + 1, items.length - 1)
          : Math.max(prevIndex - 1, 0)
      );
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

  const handleSwipe = (
    event: HandlerStateChangeEvent<Record<string, unknown>>
  ) => {
    const { translationY } = event.nativeEvent;

    if (
      (translationY as number) < -height / 6 &&
      currentIndex < items.length - 1
    ) {
      animateTransition('up');
      setFlipped(false);
    } else if ((translationY as number) > height / 6 && currentIndex > 0) {
      animateTransition('down');
      setFlipped(false);
    } else {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    {
      useNativeDriver: true,
    }
  );

  // Create the dots for the current position indicator using NativeBase Box
  const renderDots = () => {
    return items.map((_, index) => (
      <Box
        key={index}
        bg={
          index === currentIndex
            ? flipped
              ? theme.colors.secondary[400]
              : theme.colors.primary[colorMode === 'dark' ? 500 : 600]
            : theme.colors.gray[300]
        }
        width={index === currentIndex ? 4 : 3}
        height={index === currentIndex ? 4 : 3}
        borderRadius="full"
        my={1}
      />
    ));
  };

  return (
    <Box flex={1} position="relative">
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onEnded={handleSwipe}
        activeOffsetY={[-20, 20]}
      >
        <Animated.View
          style={{
            transform: [{ translateY }],
            opacity,
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FlipCard
            frontText={items[currentIndex].question}
            backText={items[currentIndex].answer}
            flipped={flipped}
            setFlipped={setFlipped}
          />
        </Animated.View>
      </PanGestureHandler>

      {/* Dots Indicator on the right side */}
      <Box
        position="absolute"
        right={4}
        top="50%"
        // style={{ transform: [{ translateY: -height * 0.1 }] }} // Adjusting position without transform directly on VStack
      >
        <VStack justifyContent="center" alignItems="center" space={2}>
          {renderDots()}
        </VStack>
      </Box>
    </Box>
  );
};

export default VerticalFeed;
