import mongoose, { Schema, Document } from 'mongoose';
import { ISignupFlowConfig, UserAttributes } from '@afro-hack/types';

type SignupDoc = ISignupFlowConfig & Document;

const SignupFlowConfigSchema: Schema = new Schema<SignupDoc>({
  question: { type: String, required: true },
  type: { type: String, required: true },
  options: { type: [Object], default: [] },
  field: { type: String, enum: UserAttributes, required: true },
  order: { type: Number, required: true },
});

export default mongoose.model<ISignupFlowConfig>(
  'SignupFlowConfig',
  SignupFlowConfigSchema
);
