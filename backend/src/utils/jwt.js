import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Set it in your .env file.');
}

export const signToken = (userId) => {
  const payload = { id: userId };
  return jwt.sign(payload, JWT_SECRET || 'fallback_dev_secret', { expiresIn: '7d' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET || 'fallback_dev_secret');
};


