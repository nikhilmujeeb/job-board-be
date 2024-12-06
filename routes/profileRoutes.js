import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { createOrUpdateProfile, getProfileById } from '../controllers/profileController.js';
import Profile from '../models/Profile.js';

const router = express.Router();

router.post('/profile', authMiddleware, createOrUpdateProfile);
router.get('/profile/:id', authMiddleware, getProfileById);

router.get('/profiles', authMiddleware, async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', 'name email');

    const profilesWithResumeUrls = profiles.map(profile => ({
      ...profile.toObject(),
      resume: profile.resume
        ? `${process.env.BASE_URL || 'https://job-board-fe-pwmj.onrender.com'}/uploads/${profile.resume}`
        : null // Handle cases where resume is not present
    }));

    res.status(200).json(profilesWithResumeUrls);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ message: "Failed to fetch profiles" });
  }
});

export default router;
