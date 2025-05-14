import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import connectDB from './src/config/db.js';
import routes from './src/routes/index.js';

// for file upload
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import errorHandler from './src/middlewares/errorMiddleware.js';
import File from './src/models/File.js';

dotenv.config();
const app = express();

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Define customer-specific upload directories
const getCustomerUploadPath = (customerId) => {
  const customerDir = path.join(uploadsDir, customerId.toString());
  if (!fs.existsSync(customerDir)) {
    fs.mkdirSync(customerDir, { recursive: true });
  }
  return customerDir;
};
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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

app.use(express.static('public')); // Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir)); // Serve static files from the uploads directory

app.post(
  '/api/customers/:customerId/files',
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Create file metadata in MongoDB
      const file = new File({
        customerId: req.params.customerId,
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });

      await file.save();

      res.status(201).json({
        message: 'File uploaded successfully',
        file: {
          id: file._id,
          originalname: file.originalname,
          filename: file.filename,
          size: file.size,
          mimetype: file.mimetype,
          uploadDate: file.uploadDate,
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  },
);

// get all files for a customer
app.get('/api/customers/:customerId/files', async (req, res) => {
  try {
    const files = await File.find({
      customerId: req.params.customerId,
    }).sort({ uploadDate: -1 });
    if (!files || files.length === 0) {
      return res
        .status(404)
        .json({ message: 'No files found for this customer' });
    }
    res.status(200).json({
      count: files.length,
      files: files.map((file) => ({
        id: file._id,
        originalname: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        uploadDate: file.uploadDate,
        url: `/uploads/${req.params.customerId}/${file.filename}`,
      })),
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// Routes
app.use('/api', routes);

app.use(errorHandler);

// Connect to Database & Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
