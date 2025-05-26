import File from '../models/File.js';

export const uploadB2bCustomerQuotation = async (req, res) => {
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
};

export const getB2BCustomerQuotation = async (req, res) => {
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
};
