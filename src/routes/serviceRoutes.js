import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  addService,
  editService,
  getServices,
} from '../controllers/staffController.js';

const router = express.Router();

router.get('/', protect, getServices);
router.post('/add', protect, addService);
router.patch('/:id/update', protect, editService);

export default router;
