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
  Checkbox, // Import Checkbox
} from 'native-base';
import { useUserContext } from '../context/user-context';
import { useSignupFlowConfigContext } from '../context/signup-config';
import { ISignupFlowConfig } from '@afro-hack/types';

const SignupField = ({
  question,
  value,
  setValue,
  type,
  options = [],
}: {
  question: string;
  value: string | string[]; // Accept string or array for multi-select
  setValue: (value: string | string[]) => void;
  type: string;
  options?: ISignupFlowConfig['options'];
}) => {
  return (
    <>
      <Text fontSize="xl" mb={4}>
        {question}
      </Text>
      {type === 'text' && (
        <Input
          placeholder="Enter your answer"
          value={typeof value === 'string' ? value : ''}
          onChangeText={setValue as (value: string) => void}
          width="80%"
        />
      )}
      {type === 'dropdown' && (
        <Select
          selectedValue={typeof value === 'string' ? value : ''}
          minWidth="200"
          placeholder="Choose an option"
          _selectedItem={{
            bg: 'primary.600',
            endIcon: <CheckIcon size="5" />,
          }}
          onValueChange={setValue as (value: string) => void}
        >
          {options.map((option) => (
            <Select.Item
              label={option.option}
              value={option.option.toLowerCase()}
              key={option.option}
            />
          ))}
        </Select>
      )}
      {type === 'radio' && (
        <Radio.Group
          name="radioGroup"
          value={typeof value === 'string' ? value : ''}
          onChange={(nextValue) => setValue(nextValue)}
        >
          {options.map((option) => (
            <Radio key={option.option} value={option.option}>
              {option.option}
            </Radio>
          ))}
        </Radio.Group>
      )}
      {type === 'checkbox' && (
        <Checkbox.Group
          onChange={(selectedValues) => setValue(selectedValues || [])}
          defaultValue={Array.isArray(value) ? value : []}
        >
          {options.map((option) => (
            <Checkbox key={option.option} value={option.option}>
              {option.option}
            </Checkbox>
          ))}
        </Checkbox.Group>
      )}
    </>
  );
};

// Reusable component for signup pages
const SignupPage = ({
  question,
  value,
  setValue,
  onNext,
  progress,
  type,
  disableContinue,
  options = [],
  subSignupPage,
}: {
  question: string;
  value: string | string[]; // Accept string or array for multi-select
  setValue: (value: string | string[]) => void;
  onNext: () => void;
  progress: number;
  type: string;
  disableContinue: boolean;
  options?: ISignupFlowConfig['options'];
  subSignupPage?: React.ReactNode;
}) => {
  return (
    <VStack flex={1} padding={4} justifyContent="center" alignItems="center">
      <Center flexGrow={1}>
        <SignupField
          question={question}
          value={value}
          setValue={setValue}
          type={type}
          options={options}
        />
        {subSignupPage}
      </Center>

      <Progress value={progress} width="80%" mb={4} />
      <Button onPress={onNext} isDisabled={disableContinue} width="80%">
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
  const [answers, setAnswers] = useState<(string | string[])[]>(
    Array(signUpFlowConfig.length).fill('')
  );
  const [subAnswers, setSubAnswers] = useState<
    Record<string, string | string[]>
  >({});
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep === signUpFlowConfig.length - 1) {
      const fields = answers.reduce<any>((acc, answer, i) => {
        return { ...acc, [signUpFlowConfig[i].field]: answer };
      }, {});
      createUser({ ...fields, ...subAnswers });
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleInputChange = (value: string | string[]) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentStep] = value;
    setSubAnswers({});
    setAnswers(updatedAnswers);
  };

  const handleSubInputChange = (
    stepIndex: string,
    value: string | string[]
  ) => {
    setSubAnswers((prev) => ({ ...prev, [stepIndex]: value }));
  };

  const currentConfig = signUpFlowConfig[currentStep];
  const selectedOption = currentConfig.options?.find(
    (option) =>
      option.option.toLowerCase() ===
      (Array.isArray(answers[currentStep])
        ? answers[currentStep][0]?.toLowerCase()
        : answers[currentStep]?.toLowerCase())
  );

  const progress = ((currentStep + 1) / signUpFlowConfig.length) * 100;

  const renderSubSignupPage = (
    subOptions: ISignupFlowConfig[] | undefined,
    parentStep: number
  ) => {
    if (!subOptions || subOptions.length === 0) return null;
    return subOptions.map((subOption, index) => {
      const stepIndex = `${subOption.field}`;
      return (
        <Center mt={8} key={stepIndex}>
          <SignupField
            question={subOption.question}
            value={subAnswers[stepIndex] || ''}
            setValue={(value) => handleSubInputChange(stepIndex, value)}
            type={subOption.type}
            options={subOption.options}
          />
        </Center>
      );
    });
  };

  return (
    <SignupPage
      question={currentConfig.question}
      value={answers[currentStep]}
      setValue={handleInputChange}
      onNext={handleNext}
      progress={progress}
      type={currentConfig.type}
      disableContinue={
        !answers[currentStep] ||
        !!(
          selectedOption?.subOptions?.length &&
          !subAnswers[selectedOption.subOptions[0].field]
        )
      }
      options={currentConfig.options}
      subSignupPage={renderSubSignupPage(
        selectedOption?.subOptions,
        currentStep
      )}
    />
  );
};

export default SignupFlow;
