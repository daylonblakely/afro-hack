import React from 'react';
import { Fab, Icon, useDisclose, useColorModeValue } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import StaggerModal from './StaggerModal';
import MenuIcon, { MenuIconProps } from './MenuIcon';

interface CustomFabProps {
  menuIcons: MenuIconProps[];
}

const CustomFab = ({ menuIcons }: CustomFabProps) => {
  const fabColor = useColorModeValue('secondary.500', 'secondary.400');
  const { isOpen, onToggle } = useDisclose();

  return (
    <>
      <Fab
        position="absolute"
        size="md"
        icon={<Icon as={MaterialIcons} name="menu" size={'md'} />}
        placement="bottom-right"
        backgroundColor={fabColor}
        onPress={onToggle}
      ></Fab>
      <StaggerModal isOpen={isOpen} onToggle={onToggle}>
        {menuIcons.map(({ bg, icon, text, onPress, disabled }, i) => (
          <MenuIcon
            disabled={disabled}
            bg={bg}
            icon={icon}
            text={text}
            onPress={onPress}
            key={i}
          />
        ))}
      </StaggerModal>
    </>
  );
};

export default CustomFab;
