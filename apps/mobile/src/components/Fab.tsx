import React from 'react';
import { Fab, Icon, useTheme, useDisclose } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import StaggerModal from './StaggerModal';
import MenuIcon, { MenuIconProps } from './MenuIcon';

interface CustomFabProps {
  menuIcons: MenuIconProps[];
}

const CustomFab = ({ menuIcons }: CustomFabProps) => {
  const theme = useTheme();
  const { isOpen, onToggle } = useDisclose();

  return (
    <>
      <Fab
        position="absolute"
        size="sm"
        icon={<Icon as={MaterialIcons} name="menu" />}
        placement="bottom-right"
        bg={theme.colors.secondary[500]}
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
