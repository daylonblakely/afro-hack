import { ChatOpenAI } from '@langchain/openai';

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
