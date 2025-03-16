import express from 'express';
import { getAllStaff, getUsers } from '../controllers/userController.js';
import { adminOnly, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/staffs', protect, adminOnly, getAllStaff);

export default router;
