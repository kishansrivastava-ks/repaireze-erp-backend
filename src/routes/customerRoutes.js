import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  addB2BCustomer,
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

// for b2b customers
router.post('/b2b/add', protect, addB2BCustomer);

export default router;
