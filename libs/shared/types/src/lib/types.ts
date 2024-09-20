export interface IPrompt {
  prompt: string;
  question: string;
  answer: string;
  createdDate: Date;
}

export interface IUser {
  name: string;
  email: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}
