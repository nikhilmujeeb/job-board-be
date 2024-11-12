import express from 'express';
import { createJobRequest, approveJobRequest, getJobs, uploadResume } from '../controllers/jobController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Define job routes
router.post('/request', authMiddleware, createJobRequest);
router.put('/approve/:id', authMiddleware, adminMiddleware, approveJobRequest);
router.get('/', getJobs);

// Resume upload route
router.post('/upload-resume', authMiddleware, upload.single('resume'), uploadResume);

export default router;
