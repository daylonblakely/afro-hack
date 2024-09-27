import React, { useRef, useCallback, useEffect } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import {
  Box,
  Text,
  useTheme,
  ScrollView,
  useColorModeValue,
} from 'native-base';
import {
  TapGestureHandler,
  State,
  TapGestureHandlerGestureEvent,
  gestureHandlerRootHOC,
} from 'react-native-gesture-handler';
import { theme } from '../app/theme';

interface FlipCardProps {
  frontText?: string;
  backText?: string;
  flipped: boolean;
  setFlipped: React.Dispatch<React.SetStateAction<boolean>>;
}

type ScrollViewRef = {
  scrollTo: any;
};

const FlipCard = ({
  frontText,
  backText,
  flipped,
  setFlipped,
}: FlipCardProps) => {
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollViewRef>(null);
  const cardBg = useColorModeValue(
    theme.onBackgroundColor.light,
    theme.onBackgroundColor.dark
  );

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
        <Animated.View
          style={[
            styles.cardStyle,
            frontAnimatedStyle,
            {
              backgroundColor: cardBg,
              borderColor: theme.colors.primary[400],
            },
          ]}
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
              fontSize="2xl"
              fontWeight="bold"
              textAlign="center"
              lineHeight="lg"
            >
              {frontText}
            </Text>
          </ScrollView>
        </Animated.View>

        {/* Back of the card */}
        <Animated.View
          style={[
            styles.cardStyle,
            backAnimatedStyle,
            {
              backgroundColor: cardBg,
              borderColor: theme.colors.secondary[400],
            },
          ]}
          pointerEvents={flipped ? 'auto' : 'none'}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
            scrollEventThrottle={16}
            nestedScrollEnabled={true}
            ref={scrollRef}
          >
            <Text fontSize="xl" textAlign="center" lineHeight="xl">
              {backText}
            </Text>
          </ScrollView>
        </Animated.View>
      </Box>
    </TapGestureHandler>
  );
};

// Extract static styles using StyleSheet.create
const styles = StyleSheet.create({
  cardStyle: {
    width: '90%',
    height: '70%',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    // borderWidth: 2,
    borderRadius: 10,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
});

export default gestureHandlerRootHOC(FlipCard, { width: '100%' });
