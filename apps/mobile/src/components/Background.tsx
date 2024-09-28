import React from 'react';
import { Box, useColorMode } from 'native-base';
import { theme } from '../app/theme';
import SvgImage from '../../assets/image.svg';

const Background = () => {
  const { colorMode } = useColorMode();
  const bgColor = theme.backgroundColor[colorMode || 'dark'];

  return (
    <Box flex={1} backgroundColor={bgColor} position={'absolute'}>
      <SvgImage
        style={{
          // position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    </Box>
  );
};

export default Background;
