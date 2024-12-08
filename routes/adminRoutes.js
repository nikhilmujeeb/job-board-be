import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { manageUsers, checkUserAdmin, makeAdmin, deleteUser } from '../controllers/adminController.js';

const router = express.Router();

router.get('/check-admin', authMiddleware, adminMiddleware, checkUserAdmin);
router.get('/manage-users', authMiddleware, adminMiddleware, manageUsers);
router.put('/make-admin/:userId', authMiddleware, makeAdmin);
router.delete('/delete-user/:userId', authMiddleware, deleteUser);

export default router;