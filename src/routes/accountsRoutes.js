import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  addPayable,
  addReceivable,
  editPayable,
  editReceivable,
  getAllPayables,
  getAllReceivables,
} from '../controllers/accountsController.js';

const router = express.Router();

router.post('/receivables/new', protect, addReceivable);
router.post('/payables/new', protect, addPayable);

router.get('/payables', protect, getAllPayables);
router.get('/receivables', protect, getAllReceivables);

router.patch('/receivables/:receivableId', protect, editReceivable);
router.patch('/payables/:payableId', protect, editPayable);

export default router;
