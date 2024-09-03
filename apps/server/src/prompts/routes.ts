import { Router, Request, Response } from 'express';
import { IPrompt } from '@afro-hack/types';

const router = Router();

router.get('/latest', (req: Request, res: Response) => {
  const p: IPrompt = {
    prompt: 'hahaha',
    createdTimestamp: new Date(),
  };
  res.send(p);
});

export default router;
