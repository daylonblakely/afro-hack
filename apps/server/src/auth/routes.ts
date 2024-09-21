import express, { Request, Response } from 'express';
import { verifyToken } from './middlewares/verify-token';
import { createUser, findUserByEmail } from './auth.service';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.get('/currentUser', verifyToken, async (req: Request, res: Response) => {
  const { email } = req.user;

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new BadRequestError('User already exists');
  }
  res.send(existingUser.toObject());
});

router.post('/signup', verifyToken, async (req: Request, res: Response) => {
  const { name } = req.body;
  const { email } = req.user;

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new BadRequestError('User already exists');
  }

  const newUser = await createUser(name, email);

  res.status(201).send(newUser.toObject());
});

export default router;
