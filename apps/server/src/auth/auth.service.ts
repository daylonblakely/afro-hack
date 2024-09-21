import User from './models/User';

export const createUser = async (name: string, email: string) => {
  const newUser = new User({
    name,
    email,
  });

  return newUser.save();
};

export const findUserByEmail = (email: string) => {
  return User.findOne({ email: email });
};
