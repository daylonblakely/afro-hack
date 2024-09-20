import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, VStack, Text, useColorModeValue } from 'native-base';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export interface MenuIconProps {
  bg: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  text: string;
  disabled: boolean;
}

const MenuIcon = ({
  bg,
  icon,
  onPress,
  text,
  disabled,
  ...rest
}: MenuIconProps) => {
  const lineColor = useColorModeValue('black', 'white');

  return (
    <VStack alignItems="center">
      <IconButton
        // mb="4"
        disabled={disabled}
        variant="solid"
        size={16}
        colorScheme={bg.split('.')[0]} //color when pressed
        borderRadius="full"
        onPress={onPress}
        icon={<MaterialIcons name={icon} size={32} color={lineColor} />}
        {...rest}
      />
      {text && (
        <Text mb="3" mt="1" bold>
          {text}
        </Text>
      )}
    </VStack>
  );
};

MenuIcon.propTypes = {
  bg: PropTypes.string,
  icon: PropTypes.string,
  onPress: PropTypes.func,
  text: PropTypes.string,
  disabled: PropTypes.bool,
};

export default MenuIcon;
