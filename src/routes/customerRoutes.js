import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  addCustomer,
  editCustomer,
  getCustomers,
  requestCustomerDeletion,
  searchCustomers,
  verifyCustomerDeletion,
} from '../controllers/staffController.js';

const router = express.Router();

router.get('/', protect, getCustomers);
router.post('/add', protect, addCustomer);
router.get('/search', protect, searchCustomers);
router.patch('/:id/update', protect, editCustomer);

router.post('/request-delete/:id', protect, requestCustomerDeletion);
router.post('/verify-delete', protect, verifyCustomerDeletion);

export default router;
