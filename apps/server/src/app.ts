import express, { Request, Response } from 'express';
import morgan from 'morgan';
import 'express-async-errors';
import { json } from 'body-parser';
import { NotFoundError } from '@afro-hack/errors';

const app = express();

app.use(morgan('combined'));

app.use(json());

// import { ChatOpenAI } from '@langchain/openai';
// app.get('/', (req: Request, res: Response) => {
//   const chatModel = new ChatOpenAI({});
//   chatModel
//     .invoke('what is LangSmith?')
//     .then((res) => console.log(res))
//     .catch((error) => console.log(error));
//   res.send('Hello, Express with TypeScript!');
// });

app.get('/', (_req: Request, res: Response) => {
  res.send('server: hello!');
});

// Catch-all route for 404 errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.all('*', async (_req, _res) => {
  throw new NotFoundError();
});

// // Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error, _req, res, _next) => {
  res.status(error.statusCode || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

export default app;
