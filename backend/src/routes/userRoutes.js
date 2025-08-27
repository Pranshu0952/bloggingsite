import { Router } from 'express';
import { getMe, getUserById, updateProfile, toggleFollow } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.get('/:id', getUserById);
router.put('/:id/follow', protect, toggleFollow);

export default router;


