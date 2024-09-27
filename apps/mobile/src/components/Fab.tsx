import React from 'react';
import {
  Fab,
  Icon,
  useTheme,
  useDisclose,
  useColorModeValue,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import StaggerModal from './StaggerModal';
import MenuIcon, { MenuIconProps } from './MenuIcon';

interface CustomFabProps {
  menuIcons: MenuIconProps[];
}

const CustomFab = ({ menuIcons }: CustomFabProps) => {
  const theme = useTheme();
  const fabColor = useColorModeValue(
    theme.colors.primary[500],
    theme.colors.primary[300]
  );
  const { isOpen, onToggle } = useDisclose();

  return (
    <>
      <Fab
        position="absolute"
        size="md"
        icon={<Icon as={MaterialIcons} name="menu" />}
        placement="bottom-right"
        color={fabColor}
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
