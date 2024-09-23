export interface IPrompt {
  prompt: string;
  question: string;
  answer: string;
  user: IUser;
  createdDate: Date;
}

export const UserAttributes = ['name', 'language', 'occupation'];

export type UserAttributesType = (typeof UserAttributes)[number];

export interface IUser {
  email: string;
  attributes: {
    [key in UserAttributesType]: string;
  };
  createdDate?: Date;
  updatedDate?: Date;
}

export interface ISignupFlowConfig {
  question: string;
  type: string;
  options?: { option: string; subOptions?: ISignupFlowConfig[] }[];
  field: UserAttributesType;
  order: number;
}
