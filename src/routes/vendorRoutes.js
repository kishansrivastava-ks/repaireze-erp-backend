import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  addVendor,
  getVendors,
  searchVendors,
} from '../controllers/staffController.js';

const router = express.Router();

router.get('/', protect, getVendors);
router.post('/add', protect, addVendor);
router.get('/search', protect, searchVendors);

export default router;
