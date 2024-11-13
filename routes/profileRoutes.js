import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { createOrUpdateProfile, getProfileById } from '../controllers/profileController.js';

const router = express.Router();

router.post('/profile', authMiddleware, createOrUpdateProfile);
router.get('/profile/:id', getProfileById);

export default router;
