import React, { useRef, useCallback, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import { Box, Text, ScrollView } from 'native-base';
import {
  TapGestureHandler,
  State,
  TapGestureHandlerGestureEvent,
  gestureHandlerRootHOC,
} from 'react-native-gesture-handler';

interface FlipCardProps {
  frontText?: string;
  backText?: string;
  flipped: boolean;
  setFlipped: React.Dispatch<React.SetStateAction<boolean>>;
}

type ScrollViewRef = {
  scrollTo: any;
};

const AnimatedBox = Animated.createAnimatedComponent(Box);

const FlipCard = ({
  frontText,
  backText,
  flipped,
  setFlipped,
}: FlipCardProps) => {
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollViewRef>(null);

  // Interpolate animation for flipping
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  // Handle double-tap gesture
  const onDoubleTap = useCallback(
    ({ nativeEvent }: TapGestureHandlerGestureEvent) => {
      if (nativeEvent.state === State.ACTIVE) {
        setFlipped((prev) => !prev);
      }
    },
    [setFlipped]
  );

  useEffect(() => {
    // toggle the flip state
    Animated.timing(flipAnimation, {
      toValue: flipped ? 180 : 0,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    scrollRef.current?.scrollTo({
      y: 0,
    });
  }, [flipped, flipAnimation]);

  return (
    <TapGestureHandler onHandlerStateChange={onDoubleTap} numberOfTaps={2}>
      <Box alignItems="center" justifyContent="center" flex={1} padding={4}>
        {/* Front of the card */}
        <AnimatedBox
          style={frontAnimatedStyle}
          variant={'card'}
          pointerEvents={flipped ? 'none' : 'auto'}
        >
          <ScrollView
            scrollEventThrottle={16}
            style={{ flex: 1 }}
            contentContainerStyle={{
              padding: 20,
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <Text
              variant={'cardText'}
              fontSize="3xl"
              fontWeight="bold"
              lineHeight="md"
            >
              {frontText}
            </Text>
          </ScrollView>
        </AnimatedBox>

        {/* Back of the card */}
        <AnimatedBox
          style={backAnimatedStyle}
          variant={'card'}
          pointerEvents={flipped ? 'auto' : 'none'}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
            scrollEventThrottle={16}
            nestedScrollEnabled={true}
            ref={scrollRef}
          >
            <Text
              variant={'cardText'}
              fontSize="2xl"
              lineHeight="lg"
              fontWeight="medium"
            >
              {backText}
            </Text>
          </ScrollView>
        </AnimatedBox>
      </Box>
    </TapGestureHandler>
  );
};

export default gestureHandlerRootHOC(FlipCard, { width: '100%' });
