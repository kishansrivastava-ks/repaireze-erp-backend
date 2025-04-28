import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  addService,
  editService,
  getServices,
  requestServiceDeletion,
  verifyServiceDeletion,
} from '../controllers/staffController.js';

const router = express.Router();

router.get('/', protect, getServices);
router.post('/add', protect, addService);
router.patch('/:id/update', protect, editService);

router.post('/request-delete/:id', protect, requestServiceDeletion);
router.post('/verify-delete', protect, verifyServiceDeletion);

export default router;
