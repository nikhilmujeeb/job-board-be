import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
  createOrUpdateProfile,
  getProfileById,
  getAllProfiles,
  uploadResume
} from '../controllers/profileController.js';
import multer from 'multer'; 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); 
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/profile', authMiddleware, createOrUpdateProfile);
router.get('/profile/:id', authMiddleware, getProfileById);
router.get('/profiles', getAllProfiles);

router.post('/upload-resume', authMiddleware, upload.single('resume'), uploadResume);

export default router;
