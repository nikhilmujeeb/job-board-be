import express from 'express';
import {
  createJobRequest, approveJobRequest, getJobs, uploadResume, getJobById, searchJobs,
  applyForJob, getApplicationStatus, updateJobListing, deleteJob, getJobApplications, jobDashboard,
  getPendingJobs
} from '../controllers/jobController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/request', authMiddleware, createJobRequest);
router.put('/approve/:id', authMiddleware, adminMiddleware, approveJobRequest);
router.get('/dashboard', authMiddleware, jobDashboard); 
router.get('/search', searchJobs); 
router.get('/', getJobs);
router.post('/apply/:id', authMiddleware, applyForJob);
router.get('/application/:id', authMiddleware, getApplicationStatus);
router.put('/:id', authMiddleware, updateJobListing);  
router.delete('/:id', authMiddleware, deleteJob); 
router.get('/applications/:id', authMiddleware, adminMiddleware, getJobApplications);
router.post('/upload-resume', authMiddleware, upload.single('resume'), uploadResume);
router.get('/:id', getJobById); 
router.get('/pending', getPendingJobs);

export default router;
