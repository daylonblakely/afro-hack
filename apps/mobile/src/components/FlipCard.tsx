import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  TouchableWithoutFeedback,
  ScrollView,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Box, Text, useTheme } from 'native-base';

interface FlipCardProps {
  frontText?: string;
  backText?: string;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const FlipCard = ({ frontText, backText, onScroll }: FlipCardProps) => {
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
      <Box alignItems="center" justifyContent="center" flex={1} padding={4}>
        {/* Front of the card */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: '80%',
              height: '60%',
              backfaceVisibility: 'hidden',
              backgroundColor: theme.colors.primary[500],
              borderRadius: 15,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 5,
              elevation: 5,
            },
            frontAnimatedStyle,
          ]}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            onScroll={onScroll} // Attach scroll handler
            scrollEventThrottle={16}
          >
            <View
              style={{
                flex: 1,
                justifyContent: frontText ? 'center' : 'flex-start',
                padding: 20,
              }}
            >
              <Text
                fontSize="xl"
                color="white"
                fontWeight="bold"
                textAlign="center"
                lineHeight="lg"
              >
                {frontText}
              </Text>
            </View>
          </ScrollView>
        </Animated.View>

        {/* Back of the card */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: '80%',
              height: '60%',
              backfaceVisibility: 'hidden',
              backgroundColor: theme.colors.secondary[500],
              borderRadius: 15,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 5,
              elevation: 5,
            },
            backAnimatedStyle,
          ]}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            onScroll={onScroll} // Attach scroll handler
            scrollEventThrottle={16}
          >
            <View
              style={{
                flex: 1,
                justifyContent: backText ? 'center' : 'flex-start',
                padding: 20,
              }}
            >
              <Text
                fontSize="xl"
                color="white"
                fontWeight="bold"
                textAlign="center"
                lineHeight="lg"
              >
                {backText}
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default FlipCard;
