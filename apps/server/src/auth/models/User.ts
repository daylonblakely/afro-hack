import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '@afro-hack/types';

type UserDoc = IUser & Document;

const UserSchema: Schema = new Schema<UserDoc>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdDate: {
    type: Date,
    default: Date.now,
    required: true,
    get: (date: any) => {
      if (date instanceof Date) {
        return date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
      }
      return date;
    },
  },
  updatedDate: {
    type: Date,
    required: false,
    get: (date: any) => {
      if (date instanceof Date) {
        return date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
      }
      return date;
    },
  },
});

// Ensure getters are applied when converting to JSON and objects
UserSchema.set('toJSON', { getters: true });
UserSchema.set('toObject', { getters: true });

const User = mongoose.model<UserDoc>('User', UserSchema);

export default User;
