import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { addVendor, getVendors } from '../controllers/staffController.js';

const router = express.Router();

router.get('/', protect, getVendors);
router.post('/add', protect, addVendor);

export default router;
