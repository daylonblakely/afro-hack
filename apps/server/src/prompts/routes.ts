import { Router, Request, Response } from 'express';
import Prompt from './models/Prompt';
import { createUsersDailyPrompts } from './prompt.service';
import { findUserByEmail } from '../auth/auth.service';

import { NotFoundError } from '../errors/not-found-error';
import { IPrompt } from '@afro-hack/types';

const router = Router();

router.get('/latest', async (req: Request, res: Response) => {
  const user = await findUserByEmail(req.user.email);

  let latestPrompts: IPrompt[] = await Prompt.find({ user: user.id })
    .sort({ createdDate: -1 })
    .limit(3);

  if (!latestPrompts.length) {
    latestPrompts = await createUsersDailyPrompts(user.id, user);
  }
  res.status(200).send(latestPrompts);
});

export default router;
