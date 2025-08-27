import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUser,
  updatePost,
  deletePost,
  toggleLikePost,
  addComment,
  deleteComment,
} from '../controllers/postController.js';

const router = Router();

router.get('/', getAllPosts);
router.post('/', protect, upload.single('image'), createPost);
router.get('/user/:userId', getPostsByUser);
router.get('/:id', getPostById);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, toggleLikePost);
router.post('/:id/comment', protect, addComment);
router.delete('/:id/comment/:commentId', protect, deleteComment);

export default router;


