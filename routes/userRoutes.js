import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import Job from '../models/Job.js'; 
import { getUserProfile } from '../controllers/userController.js';

const router = express.Router();

// Route to fetch user profile (already existing)
router.get('/profile', authMiddleware, getUserProfile);

router.get('/getJobsApplied', authMiddleware, async (req, res) => {
    try {
      // Fetch jobs applied by the user; no need to populate 'company' as it's a string field
      const appliedJobs = await Job.find({ applicants: req.user._id }).populate('company', 'name');
      res.json({ jobs: appliedJobs });           
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      res.status(500).json({ message: 'Failed to fetch applied jobs' });
    }
});

export default router;
