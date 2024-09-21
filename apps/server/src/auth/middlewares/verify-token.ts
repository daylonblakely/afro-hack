import admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';

import { NotAuthorizedError } from '../../errors/not-authorized-error';

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    throw new NotAuthorizedError();
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.user = decodedToken;
    next();
  } catch (error) {
    throw new NotAuthorizedError();
  }
};
