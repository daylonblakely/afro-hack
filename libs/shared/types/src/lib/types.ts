export interface IPrompt {
  prompt: string;
  result: string;
  consensus?: string;
  createdDate: Date;
}

export interface IUser {
  name: string;
  email: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}
