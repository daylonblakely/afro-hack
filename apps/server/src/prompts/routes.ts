import { Router, Request, Response } from 'express';
import Prompt from './models/Prompt';
import { getQuizQAndA } from './prompt.service';

import { NotFoundError } from '../errors/not-found-error';

const router = Router();

router.get('/latest', async (req: Request, res: Response) => {
  const latestPrompt = await Prompt.findOne().sort({ createdDate: -1 });

  if (!latestPrompt) {
    throw new NotFoundError();
  }
  res.status(200).send(latestPrompt);
});

router.route('/').post(async (req: Request, res: Response) => {
  const result = await getQuizQAndA();

  res.status(201).send(result);
});

export default router;
