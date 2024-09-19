import express, { Request, Response } from 'express';
import { verifyToken } from './middlewares/verify-token';
import User from './models/User';

const router = express.Router();

router.get('/currentUser', verifyToken, (req: Request, res: Response) => {
  res.send(req.user);
});

export default router;
