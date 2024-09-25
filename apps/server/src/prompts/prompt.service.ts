import { ChatOpenAI } from '@langchain/openai';
import { IUser } from '@afro-hack/types';
import {
  generateDevelopmentCardPrompt,
  generateQuizPrompt,
  generateQuotePrompt,
} from './flash-card';

const model = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0,
});

export const getQuizQAndA = async () => {
  const structuredLlm = model.withStructuredOutput({
    name: 'quiz',
    description: 'Quiz question for the user',
    parameters: {
      title: 'Quiz',
      type: 'object',
      properties: {
        question: { type: 'string', description: 'The question for the quiz' },
        answer: { type: 'string', description: 'The answer to the quiz' },
      },
      required: ['question', 'answer'],
    },
  });

  const result = await structuredLlm.invoke(
    'Give me a quiz question about software engineering interviews'
    // { name: 'quiz' }
  );

  console.log(result);

  return result;
};

export const createUsersDailyPrompts = async (user: IUser) => {
  const prompts = [
    generateDevelopmentCardPrompt(user, []),
    generateQuizPrompt(user, []),
    generateQuotePrompt(user, []),
  ];

  for await (const prompt of prompts) {
    console.log('---------------------');
    console.log(prompt);
  }
};
