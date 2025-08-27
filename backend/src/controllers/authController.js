import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';

export const register = async (req, res, next) => {
  try {
    const { username, email, password, avatar, bio } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email and password' });
    }
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ message: 'User with that email or username already exists' });
    }
    const user = await User.create({ username, email, password, avatar: avatar || '', bio: bio || '' });
    const token = signToken(user._id);
    res.status(201).json({
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = signToken(user._id);
    res.json({ user: user.toJSON(), token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  // Stateless JWT – client should discard token
  res.json({ message: 'Logged out' });
};


