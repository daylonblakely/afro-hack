import mongoose, { Schema, Document } from 'mongoose';
import { IPrompt } from '@afro-hack/types';

type PromptDoc = IPrompt & Document;

const promptSchema: Schema = new Schema({
  prompt: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, default: null },
  createdDate: {
    type: Date,
    required: true,
    get: (date: Date) => date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
  },
});

// Ensure getters are applied when converting to JSON
promptSchema.set('toJSON', { getters: true });

export default mongoose.model<PromptDoc>('Prompt', promptSchema);
