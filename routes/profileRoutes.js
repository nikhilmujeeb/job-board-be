import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { createOrUpdateProfile, getProfile } from '../controllers/profileController.js';

const router = express.Router();

router.post('/profiles', authMiddleware, createOrUpdateProfile);
router.get('/profiles/:id', authMiddleware, getProfile);

export default router;
