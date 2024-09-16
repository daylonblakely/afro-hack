import React, { useState } from 'react';
import {
  VStack,
  Button,
  Input,
  Text,
  Center,
  Progress,
  Select,
  CheckIcon,
} from 'native-base';
import {
  useNavigation,
  NavigationProp,
  RouteProp,
} from '@react-navigation/native';
import { RootStackParamList } from '../types/root-stack-param-list';
import { useUserContext } from '../context/user-context';

type SignUpScreenNavigationProp = NavigationProp<RootStackParamList, 'Signup1'>;
type SignUpScreenRouteProp2 = RouteProp<RootStackParamList, 'Signup2'>;
type SignUpScreenRouteProp3 = RouteProp<RootStackParamList, 'Signup3'>;

const SignupScreen1 = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [answer1, setAnswer1] = useState('');

  const handleNext = () => {
    navigation.navigate('Signup2', { answer1 });
  };

  return (
    <SignupPage
      question="What's your name?"
      value={answer1}
      setValue={setAnswer1}
      onNext={handleNext}
      progress={33}
    />
  );
};

const SignupScreen2 = ({ route }: { route: SignUpScreenRouteProp2 }) => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [answer2, setAnswer2] = useState('');

  const handleNext = () => {
    navigation.navigate('Signup3', { ...route.params, answer2 });
  };

  return (
    <SignupPage
      question="What's your favorite color?"
      value={answer2}
      setValue={setAnswer2}
      onNext={handleNext}
      progress={66}
      isDropdown={true}
    />
  );
};

const SignupScreen3 = ({ route }: { route: SignUpScreenRouteProp3 }) => {
  const { createUser } = useUserContext();
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [answer3, setAnswer3] = useState('');

  const handleComplete = async () => {
    const { answer1, answer2 } = route.params;
    // Handle final submission logic (e.g., send answers to API)
    // navigation.navigate('Home');
    await createUser();
  };

  return (
    <SignupPage
      question="What's your preferred language?"
      value={answer3}
      setValue={setAnswer3}
      onNext={handleComplete}
      progress={100}
    />
  );
};

// Reusable component for signup pages
const SignupPage = ({
  question,
  value,
  setValue,
  onNext,
  progress,
  isDropdown = false,
}: {
  question: string;
  value: string;
  setValue: any;
  onNext: any;
  progress: number;
  isDropdown?: boolean;
}) => {
  return (
    <VStack flex={1} padding={4} justifyContent="center" alignItems="center">
      <Center flexGrow={1}>
        <Text fontSize="xl" mb={4}>
          {question}
        </Text>
        {isDropdown ? (
          <Select
            selectedValue={value}
            minWidth="200"
            placeholder="Choose an option"
            _selectedItem={{
              bg: 'primary.600',
              endIcon: <CheckIcon size="5" />,
            }}
            onValueChange={(itemValue) => setValue(itemValue)}
          >
            <Select.Item label="Red" value="red" />
            <Select.Item label="Blue" value="blue" />
            <Select.Item label="Green" value="green" />
          </Select>
        ) : (
          <Input
            placeholder="Enter your answer"
            value={value}
            onChangeText={setValue}
            width="80%"
          />
        )}
      </Center>

      <Progress value={progress} width="80%" mb={4} />
      <Button onPress={onNext} width="80%">
        <Text color="white">{progress === 100 ? 'Complete' : 'Next'}</Text>
      </Button>
    </VStack>
  );
};

export { SignupScreen1, SignupScreen2, SignupScreen3 };
