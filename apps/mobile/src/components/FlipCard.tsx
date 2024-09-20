import React, { useRef, useState } from 'react';
import { Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Box, Text, useTheme } from 'native-base';

interface FlipCardProps {
  frontText?: string;
  backText?: string;
}

const FlipCard = ({ frontText, backText }: FlipCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  // Interpolate animation for flipping
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  // Handle double-tap gesture
  let lastTap: number | null = null;
  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap && now - lastTap < 300) {
      flipCard();
    } else {
      lastTap = now;
    }
  };

  const flipCard = () => {
    if (flipped) {
      Animated.timing(flipAnimation, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(flipAnimation, {
        toValue: 180,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
    setFlipped(!flipped);
  };

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <TouchableWithoutFeedback onPress={handleDoubleTap}>
      <Box alignItems="center" justifyContent="center" flex={1}>
        {/* Front of the card */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: 300,
              height: 200,
              backfaceVisibility: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.primary[500],
              borderRadius: 10,
            },
            frontAnimatedStyle,
          ]}
        >
          <Text fontSize="lg" color="white" fontWeight="bold">
            {frontText}
          </Text>
        </Animated.View>

        {/* Back of the card */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: 300,
              height: 200,
              backfaceVisibility: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.secondary[500],
              borderRadius: 10,
            },
            backAnimatedStyle,
          ]}
        >
          <Text fontSize="lg" color="white" fontWeight="bold">
            {backText}
          </Text>
        </Animated.View>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default FlipCard;
