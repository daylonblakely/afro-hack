import express, { Request, Response } from 'express';
import morgan from 'morgan';
import 'express-async-errors';
import { json } from 'body-parser';
import { NotFoundError } from './errors/not-found-error';

import promptRouter from './prompts/routes';
import authRouter from './auth/routes';
import configRouter from './config/routes';

import { verifyToken } from './auth/middlewares/verify-token';

const app = express();

app.use(morgan('combined'));

app.use(json());

app.get('/', (_req: Request, res: Response) => {
  res.send('server: hello!');
});

app.use('/prompt', verifyToken, promptRouter);
app.use('/auth', authRouter);
app.use('/config', verifyToken, configRouter);

// Catch-all route for 404 errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.all('*', async (_req, _res) => {
  throw new NotFoundError();
});

// // Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error, _req, res, _next) => {
  res.status(error.statusCode || 500);
  console.error(error);
  res.json({
    error: {
      message: error.message,
    },
  });
});

export default app;
