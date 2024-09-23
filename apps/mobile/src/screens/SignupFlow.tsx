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
  Radio,
} from 'native-base';
import { useUserContext } from '../context/user-context';
import { useSignupFlowConfigContext } from '../context/signup-config';

// Reusable component for signup pages
const SignupPage = ({
  question,
  value,
  setValue,
  onNext,
  progress,
  type,
  options = [],
}: {
  question: string;
  value: string;
  setValue: (value: string) => void;
  onNext: () => void;
  progress: number;
  type: string;
  options?: string[];
}) => {
  return (
    <VStack flex={1} padding={4} justifyContent="center" alignItems="center">
      <Center flexGrow={1}>
        <Text fontSize="xl" mb={4}>
          {question}
        </Text>
        {type === 'text' && (
          <Input
            placeholder="Enter your answer"
            value={value}
            onChangeText={setValue}
            width="80%"
          />
        )}
        {type === 'dropdown' && (
          <Select
            selectedValue={value}
            minWidth="200"
            placeholder="Choose an option"
            _selectedItem={{
              bg: 'primary.600',
              endIcon: <CheckIcon size="5" />,
            }}
            onValueChange={setValue}
          >
            {options.map((option) => (
              <Select.Item
                label={option}
                value={option.toLowerCase()}
                key={option}
              />
            ))}
          </Select>
        )}
        {type === 'radio' && (
          <Radio.Group
            name="radioGroup"
            value={value}
            onChange={(nextValue) => setValue(nextValue)}
          >
            {options.map((option) => (
              <Radio key={option} value={option}>
                {option}
              </Radio>
            ))}
          </Radio.Group>
        )}
      </Center>

      <Progress value={progress} width="80%" mb={4} />
      <Button onPress={onNext} isDisabled={!value} width="80%">
        <Text color="white">{progress === 100 ? 'Complete' : 'Next'}</Text>
      </Button>
    </VStack>
  );
};

const SignupFlow = () => {
  const { state: signUpFlowConfig } = useSignupFlowConfigContext();
  const {
    actions: { createUser },
  } = useUserContext();
  const [answers, setAnswers] = useState<string[]>(
    Array(signUpFlowConfig.length).fill('')
  );
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep === signUpFlowConfig.length - 1) {
      // Final step logic (e.g., submit answers)
      const fields = answers.reduce<any>((acc, answer, i) => {
        return { ...acc, [signUpFlowConfig[i].field]: answer };
      }, {});

      createUser(fields);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleInputChange = (value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentStep] = value;
    setAnswers(updatedAnswers);
  };

  const currentConfig = signUpFlowConfig[currentStep];
  const progress = ((currentStep + 1) / signUpFlowConfig.length) * 100;

  return (
    <SignupPage
      question={currentConfig.question}
      value={answers[currentStep]}
      setValue={handleInputChange}
      onNext={handleNext}
      progress={progress}
      type={currentConfig.type}
      options={currentConfig.options}
    />
  );
};

export default SignupFlow;
