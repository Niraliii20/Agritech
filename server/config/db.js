import mongoose from 'mongoose';
import { autoSeedIfEmpty } from './autoSeed.js';

let isConnecting = false;

export const connectDB = async () => {
  if (isConnecting) return;
  isConnecting = true;

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agritech';

  try {
    console.log(`[MongoDB] Connecting to database...`);
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 7000,
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.name} @ ${conn.connection.host}`);
    isConnecting = false;

    // Run auto-seed check after connection
    setTimeout(() => {
      autoSeedIfEmpty().catch(err => {
        console.error('[MongoDB AutoSeed] Warning:', err.message);
      });
    }, 1500);

    return conn;
  } catch (error) {
    isConnecting = false;
    console.error(`[MongoDB] Connection error: ${error.message}`);
    console.log(`[MongoDB] Retrying connection in 8 seconds (server will remain running)...`);
    setTimeout(connectDB, 8000);
  }
};
