import { Post } from '../models/Post.js';
import { User } from '../models/User.js';
import { cloudinary, isCloudinaryConfigured } from '../utils/cloudinary.js';
import path from 'path';

const populatePost = (query) =>
  query
    .populate('user', 'username avatar')
    .populate('comments.user', 'username avatar');

export const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || content.trim().length === 0) return res.status(400).json({ message: 'Content is required' });

    let imageUrl = '';
    if (req.file) {
      if (isCloudinaryConfigured) {
        const uploadRes = await cloudinary.uploader.upload(req.file.path, { folder: 'social-app/posts' });
        imageUrl = uploadRes.secure_url;
      } else {
        // Serve locally uploaded file
        imageUrl = `/uploads/${path.basename(req.file.path)}`;
      }
    }

    const post = await Post.create({ user: req.user._id, content, image: imageUrl });
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { posts: post._id } });
    const populated = await populatePost(Post.findById(post._id));
    res.status(201).json(await populated);
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await populatePost(Post.find({})).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await populatePost(Post.findById(req.params.id));
    const data = await post;
    if (!data) return res.status(404).json({ message: 'Post not found' });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getPostsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const posts = await populatePost(Post.find({ user: userId })).sort({ createdAt: -1 });
    res.json(await posts);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (String(post.user) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });

    if (typeof content === 'string') post.content = content;
    if (req.file) {
      if (isCloudinaryConfigured) {
        const uploadRes = await cloudinary.uploader.upload(req.file.path, { folder: 'social-app/posts' });
        post.image = uploadRes.secure_url;
      } else {
        post.image = `/uploads/${path.basename(req.file.path)}`;
      }
    }
    await post.save();
    const populated = await populatePost(Post.findById(post._id));
    res.json(await populated);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (String(post.user) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    await Post.deleteOne({ _id: post._id });
    await User.findByIdAndUpdate(req.user._id, { $pull: { posts: post._id } });
    res.json({ message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
};

export const toggleLikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const hasLiked = post.likes.some((l) => String(l) === String(req.user._id));
    if (hasLiked) {
      await Post.updateOne({ _id: post._id }, { $pull: { likes: req.user._id } });
    } else {
      await Post.updateOne({ _id: post._id }, { $addToSet: { likes: req.user._id } });
    }
    const updated = await populatePost(Post.findById(post._id));
    res.json(await updated);
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) return res.status(400).json({ message: 'Text is required' });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments.push({ user: req.user._id, text });
    await post.save();
    const populated = await populatePost(Post.findById(post._id));
    res.status(201).json(await populated);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    const isAuthor = String(comment.user) === String(req.user._id);
    const isPostOwner = String(post.user) === String(req.user._id);
    if (!isAuthor && !isPostOwner) return res.status(403).json({ message: 'Forbidden' });
    comment.deleteOne();
    await post.save();
    const populated = await populatePost(Post.findById(post._id));
    res.json(await populated);
  } catch (error) {
    next(error);
  }
};


