import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  addVendor,
  editVendor,
  getVendors,
  requestVendorDeletion,
  searchVendors,
  verifyVendorDeletion,
} from '../controllers/staffController.js';
import multer from 'multer';

const router = express.Router();

// --- Multer Configuration ---
const storage = multer.memoryStorage(); // Store image in memory as a Buffer

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image file.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1, // 1 MB limit for QR code images
  },
  fileFilter: fileFilter,
});

router.get('/', protect, getVendors);
router.post(
  '/add',
  protect,
  upload.fields([
    { name: 'qrCodeImageFile', maxCount: 1 },
    { name: 'aadharImageFile', maxCount: 1 },
    { name: 'bankDetailsFile', maxCount: 1 },
  ]),
  addVendor,
);
router.get('/search', protect, searchVendors);
// router.patch('/:id/update', protect, editVendor);
router.patch(
  '/:id/update',
  protect,
  upload.fields([
    { name: 'qrCodeImageFile', maxCount: 1 },
    { name: 'aadharImageFile', maxCount: 1 },
    { name: 'bankDetailsFile', maxCount: 1 },
  ]),
  editVendor,
);

router.post('/request-delete/:id', protect, requestVendorDeletion);
router.post('/verify-delete', protect, verifyVendorDeletion);

export default router;
