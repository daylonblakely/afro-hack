import { IUser, UserAttributesType } from '@afro-hack/types';

function generateNestedAttributes(
  attributes: UserAttributesType,
  indentLevel = 2
): string {
  const indent = ' '.repeat(indentLevel * 2);
  return Object.entries(attributes)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${indent}- ${
          key.charAt(0).toUpperCase() + key.slice(1)
        }: ${value.join(', ')}`;
      } else if (typeof value === 'object') {
        return `${indent}- ${
          key.charAt(0).toUpperCase() + key.slice(1)
        }:\n${generateNestedAttributes(
          value as UserAttributesType,
          indentLevel + 1
        )}`;
      } else {
        return `${indent}- ${
          key.charAt(0).toUpperCase() + key.slice(1)
        }: ${value}`;
      }
    })
    .join('\n');
}

export const generateDevelopmentCardPrompt = (
  user: IUser,
  recentResponses: { question: string; answer: string }[]
): string => {
  const attributeEntries = Object.entries(user.attributes)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value.join(
          ', '
        )}`;
      } else if (typeof value === 'object') {
        return `- ${
          key.charAt(0).toUpperCase() + key.slice(1)
        }:\n  ${generateNestedAttributes(value as UserAttributesType)}`;
      } else {
        return `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
      }
    })
    .join('\n');

  const recentResponsesStr = recentResponses
    .map(
      (response) =>
        `  - Question: ${response.question}\n    Answer: ${response.answer}`
    )
    .join('\n');

  return `
  You are an AI language model tasked with generating personalized flash card questions and answers for users of a workforce development app. These flash cards should focus on helping underrepresented communities in tech.
  
  Please create a flash card for a user with the following attributes:
  ${attributeEntries}
  
  Below is the history of recent flash card responses to ensure no duplicate information is provided:
  ${recentResponsesStr}
  
  Make sure the question and answer are engaging, informative, relevant to the user's profile, and not duplicated from the recent responses.
  
  Flash Card:
  Question: {generate a personalized question based on the user's attributes}
  Answer: {generate a personalized answer based on the user's attributes}
  `;
};

export const generateQuizPrompt = (
  user: IUser,
  recentQuizzes: { question: string; answer: string }[]
): string => {
  const {
    name,
    techField,
    yearsOfExperience,
    areasOfInterest,
    personalInterests,
  } = user.attributes;

  const recentQuizzesStr = recentQuizzes
    .map((quiz) => `  - Question: ${quiz.question}\n    Answer: ${quiz.answer}`)
    .join('\n');

  return `
You are an AI language model tasked with generating personalized quiz questions for users of a workforce development app. These questions should focus on testing the user's knowledge and skills in their selected field of interest. For example, if a person is interested in learning about interviews for a software engineering job, you might help them with an interview question that they might encounter.

Please create a quiz question for a user with the following attributes:
- Name: ${name}
- Tech Field: ${techField}
- Years of Experience: ${yearsOfExperience}
- Areas of Interest: ${(areasOfInterest as string[])?.join(', ')}
- Personal Interests: ${(personalInterests as string[])?.join(', ')}

Below is the history of recent quiz questions and answers to ensure no duplicate information is provided:
${recentQuizzesStr}

Make sure the question and answer are engaging, informative, relevant to the user's profile, and not duplicated from the recent quizzes. Lightly relate the answer to the user's personal interests if you see fit. This should be to help make a new topic more understandable. Use the years of experience to determine the level of simplification.

Quiz:
Question: {generate a personalized question based on the user's attributes}
Answer: {generate a personalized answer based on the user's attributes}
`;
};

export const generateQuotePrompt = (
  user: IUser,
  recentQuotes: { question: string; answer: string }[]
): string => {
  const {
    name,
    age,
    gender,
    areasOfInterest,
    ethnicBackground,
    sexualOrientation,
    personalInterests,
  } = user.attributes;

  // Format recent quotes
  const recentQuotesStr = recentQuotes
    .map((quote) => `  - ${quote}`)
    .join('\n');

  return `
  You are an AI language model tasked with generating personalized quotes for users of a workforce development app. These quotes should focus on inspiring users to learn new skills, network with others, find a new job, etc. with a focus on quotes from marginalized communities but including all useful quotes.
  
  Please create a quote for a user with the following attributes:
  - Name: ${name}
  - Age: ${age}
  - Cultural Background: ${(ethnicBackground as string[])?.join(', ')}
  - Gender: ${gender}
  - Sexual Orientation: ${sexualOrientation}
  - Areas of Interests: ${(areasOfInterest as string[])?.join(', ')}
  - Personal Interests: ${(personalInterests as string[])?.join(', ')}
  
  Below are the recently generated quotes:
  ${recentQuotesStr}
  
  Make sure the quote is engaging, informative, relevant to the user's profile, and not duplicated from recent quotes.
  
  Quote:
  Question: {generate the quote}
  Answer: {generate any background information about the quote that may be helpful to the user based on their attributes}
  `;
};
