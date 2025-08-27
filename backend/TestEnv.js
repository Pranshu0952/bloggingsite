import fs from 'fs';
import dotenv from 'dotenv';
// import dotenvExpand from 'dotenv-expand';
// dotenvExpand.expand({ parsed: envVars });

// 1. Read file directly and clean it
const envPath = '.env';
let envContent = fs.readFileSync(envPath, 'utf8');

// Remove BOM if exists and trim whitespace
envContent = envContent.replace(/^\uFEFF/, '').trim();

// 2. Manually parse the content
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=').map(part => part.trim());
  if (key && value) envVars[key] = value;
});

// 3. Assign to process.env
Object.assign(process.env, envVars);

// 4. Debug output
console.log('=== MANUALLY PARSED VARS ===');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);