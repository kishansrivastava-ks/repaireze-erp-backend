import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  addVendor,
  editVendor,
  getVendors,
  requestVendorDeletion,
  searchVendors,
  verifyVendorDeletion,
} from '../controllers/staffController.js';

const router = express.Router();

router.get('/', protect, getVendors);
router.post('/add', protect, addVendor);
router.get('/search', protect, searchVendors);
router.patch('/:id/update', protect, editVendor);

router.post('/request-delete/:id', protect, requestVendorDeletion);
router.post('/verify-delete', protect, verifyVendorDeletion);

export default router;
