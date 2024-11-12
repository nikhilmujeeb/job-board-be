import express from 'express';
import {
  createJobRequest, approveJobRequest, getJobs, uploadResume, getJobById, searchJobs,
  applyForJob, getApplicationStatus, updateJobListing, deleteJob, getJobApplications, jobDashboard
} from '../controllers/jobController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/request', authMiddleware, createJobRequest);
router.put('/approve/:id', authMiddleware, adminMiddleware, approveJobRequest);
router.get('/dashboard', authMiddleware, jobDashboard);  // Make sure /dashboard is above /:id
router.get('/search', searchJobs);  // Make sure /search is above /:id
router.get('/', getJobs);
router.post('/apply/:id', authMiddleware, applyForJob);
router.get('/application/:id', authMiddleware, getApplicationStatus);
router.put('/:id', authMiddleware, updateJobListing);  // Only admin or job poster can update
router.delete('/:id', authMiddleware, deleteJob);  // Only admin or job poster can delete
router.get('/applications/:id', authMiddleware, adminMiddleware, getJobApplications);
router.post('/upload-resume', authMiddleware, upload.single('resume'), uploadResume);
router.get('/:id', getJobById);  // Place /:id as the last route

export default router;
