import { Router, Request, Response } from 'express';
import Prompt from './models/Prompt';

import { NotFoundError } from '../errors/not-found-error';

const router = Router();

router.get('/latest', async (req: Request, res: Response) => {
  const latestPrompt = await Prompt.findOne().sort({ createdDate: -1 });

  if (!latestPrompt) {
    throw new NotFoundError();
  }
  res.status(200).send(latestPrompt);
});

export default router;
