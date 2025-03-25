import express from 'express';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import adminSetupRoute from './adminSetup.js';
import customerRoutes from './customerRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import vendorRoutes from './vendorRoutes.js';
import marketingRoutes from './marketingRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/setup', adminSetupRoute);
router.use('/customers', customerRoutes);
router.use('/services', serviceRoutes);
router.use('/vendors', vendorRoutes);
router.use('/marketing', marketingRoutes);

export default router;
