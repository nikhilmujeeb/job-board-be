import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getUserProfile } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);

router.get('/getJobsApplied', authMiddleware, async (req, res) => {
    console.log("User ID from token:", req.user._id);  // Log the user ID
    try {
      const appliedJobs = await Job.find({ applicants: req.user._id }).populate('company');
      res.json({ jobs: appliedJobs });
    } catch (error) {
      console.error("Error fetching applied jobs:", error);  // Log the error
      res.status(500).json({ message: 'Failed to fetch applied jobs' });
    }
  });  

export default router;
