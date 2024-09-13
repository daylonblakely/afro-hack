import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Make sure 'User' is your user type
    }
  }
}
