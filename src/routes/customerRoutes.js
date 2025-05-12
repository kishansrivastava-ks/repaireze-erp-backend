import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  addB2BCustomer,
  addCustomer,
  editB2BCustomer,
  editCustomer,
  getB2BCustomers,
  getCustomers,
  requestB2BCustomerDeletion,
  requestCustomerDeletion,
  searchB2bCustomer,
  searchCustomers,
  verifyB2BCustomerDeletion,
  verifyCustomerDeletion,
} from '../controllers/staffController.js';

const router = express.Router();

// b2c
router.get('/', protect, getCustomers);
router.post('/add', protect, addCustomer);
router.get('/search', protect, searchCustomers);
router.patch('/:id/update', protect, editCustomer);

router.post('/request-delete/:id', protect, requestCustomerDeletion);
router.post('/verify-delete', protect, verifyCustomerDeletion);

// for b2b customers
router.get('/b2b', protect, getB2BCustomers);
router.post('/b2b/add', protect, addB2BCustomer);
router.get('/search/b2b', protect, searchB2bCustomer);
router.patch('/b2b/:id/update', protect, editB2BCustomer);

router.post('/b2b/request-delete/:id', protect, requestB2BCustomerDeletion);
router.post('/b2b/verify-delete', protect, verifyB2BCustomerDeletion);
export default router;
