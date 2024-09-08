import { Document } from 'mongoose';

export interface IPrompt extends Document {
  prompt: string;
  result: string;
  consensus?: string;
  createdDate: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  facebookId?: string;
  createdAt: Date;
  updatedAt: Date;
}
