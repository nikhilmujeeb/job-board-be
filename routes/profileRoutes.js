import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
  createOrUpdateProfile,
  getProfileById,
  getAllProfiles
} from '../controllers/profileController.js';

const router = express.Router();

// Create or update a profile
router.post('/profile', authMiddleware, createOrUpdateProfile);

// Get a specific profile by ID
router.get('/profile/:id', authMiddleware, getProfileById);

// Get all profiles
router.get('/profiles', authMiddleware, getAllProfiles);

export default router;
