import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectMongoose() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;

  if (!uri) throw new Error('Missing MONGODB_URI in .env');

  await mongoose.connect(uri, { dbName: dbName || undefined });

  const name = mongoose.connection.name || dbName || '(default)';
  console.log('Mongoose connected. DB:', name);

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err.message);
  });

  return mongoose.connection;
}
