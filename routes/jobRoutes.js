import express from 'express';
import {
  createJobRequest, approveJobRequest, getJobs, uploadResume, getJobById, searchJobs,
  applyForJob, getApplicationStatus, updateJobListing, deleteJob, getJobApplications, jobDashboard,
  getPendingJobs, getJobsByEmployer, deleteJob
} from '../controllers/jobController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/request', authMiddleware, createJobRequest);
router.delete('/delete-job', authMiddleware, deleteJob)
router.put('/approve/:id', authMiddleware, adminMiddleware, approveJobRequest);
router.get('/dashboard', authMiddleware, jobDashboard); 
router.get('/search', searchJobs); 
router.post('/apply/:id', authMiddleware, applyForJob);
router.get('/application/:id', authMiddleware, getApplicationStatus);
router.put('/:id', authMiddleware, updateJobListing);  
router.delete('/:id', authMiddleware, deleteJob); 
router.get('/applications/:id', authMiddleware, adminMiddleware, getJobApplications);
router.post('/upload-resume', authMiddleware, upload.single('resume'), uploadResume);
router.get('/pending', getPendingJobs);
router.get('/', getJobs);
router.get("/employer-jobs", authMiddleware, getJobsByEmployer);
router.get('/:id', getJobById); 

export default router;
