import express from 'express';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import adminSetupRoute from './adminSetup.js';
import customerRoutes from './customerRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import vendorRoutes from './vendorRoutes.js';
import marketingRoutes from './marketingRoutes.js';
import accountRoutes from './accountsRoutes.js';
import leadRoutes from './leadRoutes.js';
// import fileUploadRoutes from './fileUploadRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/setup', adminSetupRoute);
router.use('/customers', customerRoutes);
router.use('/services', serviceRoutes);
router.use('/vendors', vendorRoutes);
router.use('/marketing', marketingRoutes);
router.use('/accounts', accountRoutes);
router.use('/leads', leadRoutes);
// router.use('/files', fileUploadRoutes);

export default router;
