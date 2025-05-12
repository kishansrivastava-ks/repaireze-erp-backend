import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  addB2BService,
  addService,
  editService,
  getB2BServices,
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

router.get('/b2b', protect, getB2BServices);
router.post('/b2b/add', protect, addB2BService);

export default router;
