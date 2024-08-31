import express, { Request, Response } from 'express';

const app = express();

// import { ChatOpenAI } from '@langchain/openai';
// app.get('/', (req: Request, res: Response) => {
//   const chatModel = new ChatOpenAI({});
//   chatModel
//     .invoke('what is LangSmith?')
//     .then((res) => console.log(res))
//     .catch((error) => console.log(error));
//   res.send('Hello, Express with TypeScript!');
// });

app.get('/', (req: Request, res: Response) => {
  res.send('server: hello!');
});

export default app;
