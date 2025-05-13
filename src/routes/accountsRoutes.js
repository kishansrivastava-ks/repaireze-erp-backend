import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  addPayable,
  addReceivable,
  editPayable,
  editReceivable,
  getAllPayables,
  getAllReceivables,
  requestPayableStatusChange,
  verifyPayableStatusChange,
} from '../controllers/accountsController.js';

const router = express.Router();

router.post('/receivables/new', protect, addReceivable);
router.post('/payables/new', protect, addPayable);

router.get('/payables', protect, getAllPayables);
router.get('/receivables', protect, getAllReceivables);

router.patch('/receivables/:receivableId', protect, editReceivable);
router.patch('/payables/:payableId', protect, editPayable);

router.post(
  '/payables/:id/payable-status/edit',
  protect,
  requestPayableStatusChange,
);
router.post(
  '/payables/payable-status/verify',
  protect,
  verifyPayableStatusChange,
);

export default router;
