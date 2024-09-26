import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, Text } from 'native-base';

interface CustomCheckBoxGroupProps {
  options: string[];
  onSelectionChange?: (selected: string[]) => void;
}

const CheckBoxGroup: React.FC<CustomCheckBoxGroupProps> = ({
  options,
  onSelectionChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleSelect = (option: string) => {
    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((selected) => selected !== option)
      : [...selectedOptions, option];

    setSelectedOptions(newSelectedOptions);
    if (onSelectionChange) {
      onSelectionChange(newSelectedOptions);
    }
  };

  return (
    <Box flexDirection="row" flexWrap="wrap" justifyContent="center" p="4">
      {options.map((option, index) => (
        <TouchableOpacity key={index} onPress={() => handleSelect(option)}>
          <Box
            px="4"
            py="2"
            m="1"
            borderRadius="full"
            bg={selectedOptions.includes(option) ? 'primary.500' : 'gray.200'}
            borderWidth="1"
            borderColor={
              selectedOptions.includes(option) ? 'primary.500' : 'gray.300'
            }
            alignItems="center"
          >
            <Text
              fontSize="md"
              color={selectedOptions.includes(option) ? 'white' : 'black'}
            >
              {option}
            </Text>
          </Box>
        </TouchableOpacity>
      ))}
    </Box>
  );
};

export default CheckBoxGroup;
