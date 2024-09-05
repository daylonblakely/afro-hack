import { Document } from 'mongoose';

export interface IPrompt extends Document {
  prompt: string;
  result: string;
  consensus?: string;
  createdDate: Date;
}
