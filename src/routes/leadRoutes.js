import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  addNewLead,
  moveLead,
  passToCustomer,
} from '../controllers/leadsController.js';

const router = express.Router();

router.post('/new', protect, addNewLead);
router.post('/move', protect, moveLead);
router.post('/pass-to-customer', protect, passToCustomer);

export default router;
