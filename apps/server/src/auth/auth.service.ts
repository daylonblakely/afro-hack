import User from './models/User';
import { IUser } from '@afro-hack/types';

export const createUser = async (
  email: string,
  attributes: IUser['attributes']
) => {
  const newUser = new User({
    email,
    attributes,
  });

  return newUser.save();
};

export const findUserByEmail = (email: string) => {
  return User.findOne({ email: email });
};
