import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  addNewLead,
  getAllLeads,
  getLeadsByType,
  moveLead,
  passToCustomer,
} from '../controllers/leadsController.js';

const router = express.Router();

router.post('/new', protect, addNewLead);
router.post('/move', protect, moveLead);
router.post('/pass-to-customer', protect, passToCustomer);
router.get('/all', protect, getAllLeads);
router.get('/type/:type', protect, getLeadsByType);

export default router;
