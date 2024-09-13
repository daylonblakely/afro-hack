import dotenv from 'dotenv';
import mongoose from 'mongoose';
import admin from 'firebase-admin';
import app from './app';

dotenv.config();

const port = process.env.PORT || 5000;

admin.initializeApp({ credential: admin.credential.applicationDefault() });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
