import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  getB2BCustomerQuotation,
  uploadB2bCustomerQuotation,
} from '../controllers/filesController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//create main uploads directory structure
const uploadsDir = path.join(__dirname, 'uploads');
const quotationsDir = path.join(uploadsDir, 'Quotations');
const kycDir = path.join(uploadsDir, 'KYC');

// Create necessary directories if they don't exist
[uploadsDir, quotationsDir, kycDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Define document-specific upload paths
const getEntityUploadPath = (documentType, entityId) => {
  let basePath;

  switch (documentType) {
    case 'Quotations':
      basePath = quotationsDir;
      break;
    case 'KYC':
      basePath = kycDir;
      break;
    default:
      throw new Error(`Invalid document type: ${documentType}`);
  }

  const entityDir = path.join(basePath, entityId.toString());
  if (!fs.existsSync(entityDir)) {
    fs.mkdirSync(entityDir, { recursive: true });
  }

  return entityDir;
};

// Define customer-specific upload directories
// const getCustomerUploadPath = (customerId) => {
//   const customerDir = path.join(uploadsDir, customerId.toString());
//   if (!fs.existsSync(customerDir)) {
//     fs.mkdirSync(customerDir, { recursive: true });
//   }
//   return customerDir;
// };

// configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const customerId = req.params.customerId;
    const uploadPath = getCustomerUploadPath(customerId);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
});

router.post(
  '/b2b-customer/:customerId/upload-quotation',
  protect,
  upload.single('file'),
  uploadB2bCustomerQuotation,
);
router.get(
  '/b2b-customer/:customerId/quotation',
  protect,
  getB2BCustomerQuotation,
);

export default router;
