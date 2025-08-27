// THIS MUST BE AT THE VERY TOP (before any other imports)
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure absolute paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file with debug
console.log('Loading .env from:', path.resolve(__dirname, '../.env'));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Verify loading worked
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Loaded' : '❌ Not loaded');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Loaded' : '❌ Not loaded');

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
