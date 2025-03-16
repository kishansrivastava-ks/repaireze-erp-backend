import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { addService, getServices } from '../controllers/staffController.js';

const router = express.Router();

router.get('/', protect, getServices);
router.post('/add', protect, addService);
// router.put('/:id/update', protect, updateService);
// router.delete('/:id/delete', protect, deleteService);

export default router;
