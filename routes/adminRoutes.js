import express from 'express';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { checkUserAdmin, manageUsers } from '../controllers/adminController.js';

const router = express.Router();

router.get('/check-admin', adminMiddleware, checkUserAdmin);

router.get('/manage-users', adminMiddleware, manageUsers);

export default router;
