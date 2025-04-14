import express from 'express';
import {
  loginUser,
  verifyPin,
  addStaff,
  deleteStaff,
} from '../controllers/authController.js';
import { adminOnly, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/verify-pin', protect, verifyPin);
router.post('/add-staff', protect, adminOnly, addStaff);
router.delete('/delete-staff/:id', protect, adminOnly, deleteStaff);

export default router;
