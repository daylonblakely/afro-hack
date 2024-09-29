/* eslint-disable @typescript-eslint/no-var-requires */
// Load .env file in non-Firebase environments
if (!process.env.FUNCTIONS_EMULATOR && !process.env.FIREBASE_CONFIG) {
  require('dotenv').config();
}

// Import Firebase functions if available
let firebaseFunctionsConfig: any = {};
try {
  const functions = require('firebase-functions');
  firebaseFunctionsConfig = functions.config();
} catch (error) {
  console.log('Firebase functions not available locally.');
}

// Create a centralized config object
export const config = {
  openAiApiKey:
    process.env.OPENAI_API_KEY || firebaseFunctionsConfig.api?.key || '',
  dbUrl: process.env.MONGO_URI || firebaseFunctionsConfig.db?.url || '',
  googleApplicationCreds:
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    firebaseFunctionsConfig.other?.var ||
    '',
};
