import mongoose, { Schema } from 'mongoose';
import { IPrompt } from '@afro-hack/types';

const promptSchema: Schema = new Schema({
  prompt: { type: String, required: true },
  result: { type: String, required: true },
  consensus: { type: String, default: null },
  createdDate: {
    type: Date,
    required: true,
    get: (date: Date) => date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
  },
});

// Ensure getters are applied when converting to JSON
promptSchema.set('toJSON', { getters: true });

export default mongoose.model<IPrompt>('Prompt', promptSchema);
