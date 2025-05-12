import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  addB2BService,
  addService,
  editB2BService,
  editService,
  getB2BServices,
  getServices,
  requestB2BServiceDeletion,
  requestServiceDeletion,
  verifyB2BServiceDeletion,
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
router.post('/b2b/request-delete/:id', protect, requestB2BServiceDeletion);
router.post('/b2b/verify-delete', protect, verifyB2BServiceDeletion);
router.patch('/b2b/:id/update', protect, editB2BService);

export default router;
