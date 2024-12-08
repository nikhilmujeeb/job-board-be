import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import Job from '../models/Job.js'; 

const router = express.Router();

// Route to fetch user profile (already existing)
router.get('/profile', authMiddleware, getUserProfile);

// Route to fetch jobs applied by the user and populate company data
router.get('/getJobsApplied', authMiddleware, async (req, res) => {
  try {
    // Find the applied jobs for the logged-in user and populate the company field
    const appliedJobs = await Job.find({ applicants: req.user._id })
      .populate('company', 'name'); // Ensure 'company' field is populated with the 'name' of the company

    res.json({ jobs: appliedJobs });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res.status(500).json({ message: 'Failed to fetch applied jobs' });
  }
});

export default router;
