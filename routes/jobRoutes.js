import express from 'express';
import {
  createJobRequest, approveJobRequest, getJobs, getJobById, searchJobs,
  applyForJob, getApplicationStatus, updateJobListing, deleteJob, getJobApplications, jobDashboard,
  getPendingJobs, getJobsByEmployer
} from '../controllers/jobController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/request', authMiddleware, createJobRequest);
router.put('/approve/:id', authMiddleware, adminMiddleware, approveJobRequest);
router.get('/dashboard', authMiddleware, jobDashboard); 
router.get('/search', searchJobs); 
router.post('/apply/:id', authMiddleware, applyForJob);
router.get('/application/:id', authMiddleware, getApplicationStatus);
router.put('/:id', authMiddleware, updateJobListing);  
router.delete('/:id', authMiddleware, deleteJob); 
router.get('/applications/:id', authMiddleware, adminMiddleware, getJobApplications);
router.get('/pending', getPendingJobs);
router.get('/', getJobs);
router.get("/employer-jobs", authMiddleware, getJobsByEmployer);
router.get('/:id', getJobById); 

export default router;
