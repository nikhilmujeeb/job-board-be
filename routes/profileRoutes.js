import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
  createOrUpdateProfile,
  getProfileByUserId,
  getAllProfiles,
  uploadResume,
  updateProfile,
} from '../controllers/profileController.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); 
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.pdf' && ext !== '.doc' && ext !== '.docx') {
      return cb(new Error('Only PDF, DOC, and DOCX files are allowed.'));
    }
    cb(null, true);
  },
});

const router = express.Router();

router.post('/profile', authMiddleware, createOrUpdateProfile);
router.get('/profile/:id', authMiddleware, getProfileByUserId);
router.put('/profile/:id', authMiddleware, updateProfile);
router.get('/profiles', authMiddleware, getAllProfiles);
router.post('/upload-resume', authMiddleware, upload.single('resume'), uploadResume);

export default router;