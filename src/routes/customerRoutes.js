import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  addCustomer,
  getCustomers,
  searchCustomers,
} from '../controllers/staffController.js';

const router = express.Router();

router.get('/', protect, getCustomers);
router.post('/add', protect, addCustomer);
router.get('/search', protect, searchCustomers);

export default router;
