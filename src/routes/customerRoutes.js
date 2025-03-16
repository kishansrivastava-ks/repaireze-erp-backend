import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { addCustomer, getCustomers } from '../controllers/staffController.js';

const router = express.Router();

router.get('/', protect, getCustomers);
router.post('/add', protect, addCustomer);

export default router;
