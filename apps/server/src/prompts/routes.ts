import { Router, Request, Response } from 'express';
import Prompt from './models/Prompt';
import { createUsersDailyPrompts } from './prompt.service';
import { findUserByEmail } from '../auth/auth.service';

import { IPrompt } from '@afro-hack/types';

const router = Router();

router.get('/latest', async (req: Request, res: Response) => {
  const user = await findUserByEmail(req.user.email);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let latestPrompts: IPrompt[] = await Prompt.find({
    user: user.id,
    createdDate: {
      $gte: today,
    },
  })
    .sort({ createdDate: -1 })
    .limit(3);

  if (!latestPrompts.length) {
    console.log('generating new prompts');
    latestPrompts = await createUsersDailyPrompts(user.id, user);
  } else {
    latestPrompts = latestPrompts.reverse();
  }

  res.status(200).send(latestPrompts);
});

export default router;
