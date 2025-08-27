import { User } from '../models/User.js';
import mongoose from 'mongoose';

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar')
      .populate('posts');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user id' });
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { username, avatar, bio } = req.body;
    if (username && username.length < 3) return res.status(400).json({ message: 'Username too short' });
    const updates = {};
    if (username) updates.username = username;
    if (typeof avatar === 'string') updates.avatar = avatar;
    if (typeof bio === 'string') updates.bio = bio;

    const updated = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const toggleFollow = async (req, res, next) => {
  try {
    const { id: targetUserId } = req.params;
    if (String(req.user._id) === String(targetUserId)) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }
    const target = await User.findById(targetUserId);
    if (!target) return res.status(404).json({ message: 'User not found' });

    const isFollowing = target.followers.some((f) => String(f) === String(req.user._id));
    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: target._id } });
      await User.findByIdAndUpdate(target._id, { $pull: { followers: req.user._id } }, { new: true });
      return res.json({ message: 'Unfollowed' });
    }
    // Follow
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: target._id } });
    await User.findByIdAndUpdate(target._id, { $addToSet: { followers: req.user._id } }, { new: true });
    res.json({ message: 'Followed' });
  } catch (error) {
    next(error);
  }
};


