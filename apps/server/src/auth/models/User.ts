import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '@afro-hack/types';

type UserDoc = IUser & Document;

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<UserDoc>('User', UserSchema);

export default User;
