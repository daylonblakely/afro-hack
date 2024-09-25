import React, { useState, useRef } from 'react';
import { Dimensions, Animated } from 'react-native';
import {
  PanGestureHandler,
  HandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import { IPrompt } from '@afro-hack/types';
import FlipCard from './FlipCard';

const { height } = Dimensions.get('window');

interface VerticalFeedProps {
  items: IPrompt[];
}

const VerticalFeed = ({ items }: VerticalFeedProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // New animation values
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Animate transition
  const animateTransition = (direction: 'up' | 'down') => {
    // Animate the current item out
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Change the item after the current one fades out
      setCurrentIndex((prevIndex) =>
        direction === 'up'
          ? Math.min(prevIndex + 1, items.length - 1)
          : Math.max(prevIndex - 1, 0)
      );

      // Animate the new item in
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
      currentIndex < items.length - 1
    ) {
      animateTransition('up');
    } else if ((translationY as number) > height / 6 && currentIndex > 0) {
      animateTransition('down');
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
        <FlipCard
          frontText={items[currentIndex].question}
          backText={items[currentIndex].answer}
        />
      </Animated.View>
    </PanGestureHandler>
  );
};

export default VerticalFeed;
