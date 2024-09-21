import mongoose, { Schema, Document } from 'mongoose';
import { IPrompt } from '@afro-hack/types';

type PromptDoc = IPrompt & Document;

const promptSchema: Schema<PromptDoc> = new Schema<PromptDoc>({
  prompt: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, default: null },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
    get: (date: any) => {
      if (date instanceof Date) {
        return date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
      }
      return date;
    },
  },
});

// Ensure getters are applied when converting to JSON and objects
promptSchema.set('toJSON', { getters: true });
promptSchema.set('toObject', { getters: true });

export default mongoose.model<PromptDoc>('Prompt', promptSchema);
