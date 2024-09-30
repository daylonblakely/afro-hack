import dotenv from 'dotenv';

// Load .env file
dotenv.config();
import * as functions from 'firebase-functions';
import mongoose from 'mongoose';
import admin from 'firebase-admin';
import app from './app';

const port = process.env.PORT || 5000;

// admin.initializeApp({ credential: admin.credential.applicationDefault() });

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((err) => {
//     console.error('Failed to connect to MongoDB', err);
//   });

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

export const api = functions.https.onRequest(app);
