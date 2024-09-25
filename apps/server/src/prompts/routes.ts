import { Router, Request, Response } from 'express';
import Prompt from './models/Prompt';
import { getQuizQAndA, createUsersDailyPrompts } from './prompt.service';
import { findUserByEmail } from '../auth/auth.service';

import { NotFoundError } from '../errors/not-found-error';

const router = Router();

router.get('/latest', async (req: Request, res: Response) => {
  const user = await findUserByEmail(req.user.email);
  const latestPrompts = await Prompt.find({ user: user.id })
    .sort({ createdDate: -1 })
    .limit(3);

  if (!latestPrompts.length) {
    createUsersDailyPrompts(user);
  }
  res.status(200).send(latestPrompts);
});

router.route('/').post(async (req: Request, res: Response) => {
  const result = await getQuizQAndA();

  res.status(201).send(result);
});

export default router;
