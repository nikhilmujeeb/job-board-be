import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getUserProfile } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);

router.get('/getJobsApplied', authMiddleware, async (req, res) => {
    try {
      const appliedJobs = await Job.find({ applicants: req.user._id }).populate('company');
      res.json({ jobs: appliedJobs });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch applied jobs' });
    }
  });

export default router;
