import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getUserProfile } from '../controllers/userController.js';
import Job from '../models/Job.js'; 

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);

router.get('/getJobsApplied', authMiddleware, async (req, res) => {
    try {
      // Populate 'company' field with 'name' field from the Company model
      const appliedJobs = await Job.find({ applicants: req.user._id })
        .populate('company', 'name'); // Populate the 'name' field of the company
  
      res.json({ jobs: appliedJobs });
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      res.status(500).json({ message: 'Failed to fetch applied jobs' });
    }
  });    

export default router;
