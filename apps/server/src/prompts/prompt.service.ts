import { ChatOpenAI } from '@langchain/openai';
import { IUser, IPrompt } from '@afro-hack/types';
import {
  generateDevelopmentCardPrompt,
  generateQuizPrompt,
  generateQuotePrompt,
} from './flash-card';
import Prompt from './models/Prompt';

const model = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0,
});

const getQuizQAndA = async (prompt: string) => {
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

  const result = await structuredLlm.invoke(prompt);

  return result;
};

export const createUsersDailyPrompts = async (
  userId: string,
  user: IUser
): Promise<IPrompt[]> => {
  const prompts = [
    generateDevelopmentCardPrompt(user, []),
    generateQuizPrompt(user, []),
    generateQuotePrompt(user, []),
  ];

  const cards: IPrompt[] = [];
  for await (const prompt of prompts) {
    const result = await getQuizQAndA(prompt);

    const record = new Prompt({
      prompt,
      question: result.question,
      answer: result.answer,
      user: userId,
    });
    await record.save();

    cards.push(record);
  }

  return cards;
};
