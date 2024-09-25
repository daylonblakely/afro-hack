import React, { useState, useRef, useCallback } from 'react';
import {
  Dimensions,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
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
  const [isScrolling, setIsScrolling] = useState(false);

  // Animation values
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Animate transition between cards
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

  // Handle swipe between cards
  const handleSwipe = (
    event: HandlerStateChangeEvent<Record<string, unknown>>
  ) => {
    const { translationY } = event.nativeEvent;

    // Only handle swipe if the user isn't scrolling within the card
    if (!isScrolling) {
      if (
        (translationY as number) < -height / 6 &&
        currentIndex < items.length - 1
      ) {
        animateTransition('up');
      } else if ((translationY as number) > height / 6 && currentIndex > 0) {
        animateTransition('down');
      } else {
        // Snap back to center if swipe isn't strong enough
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  // Handle scroll event within the card to detect if scrolling is active
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;

      // If the content is not at the top or bottom of the scroll view, set `isScrolling` to true
      const isScrollable =
        contentSize.height > layoutMeasurement.height &&
        contentOffset.y > 0 &&
        contentOffset.y < contentSize.height - layoutMeasurement.height;

      setIsScrolling(isScrollable);
    },
    []
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
          onScroll={handleScroll} // Pass the scroll handler to FlipCard
        />
      </Animated.View>
    </PanGestureHandler>
  );
};

export default VerticalFeed;
