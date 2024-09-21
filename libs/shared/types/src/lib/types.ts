export interface IPrompt {
  prompt: string;
  question: string;
  answer: string;
  user: IUser;
  createdDate: Date;
}

export interface IUser {
  name: string;
  email: string;
  createdDate?: Date;
  updatedDate?: Date;
}
