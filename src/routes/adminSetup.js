import express from 'express';
import bcrypt from 'bcryptjs';
// import User from '../models/User';
import User from '../models/User.js';
import { adminOnly, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-admin', protect, adminOnly, async (req, res) => {
  try {
    const { name, phone, address, alternatePhone, password } = req.body;

    const existingAdmin = await User.findOne({ phone: phone });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const adminUser = await User.create({
      name,
      phone,
      address,
      alternatePhone,
      password,
      userType: 'admin',
    });

    res
      .status(201)
      .json({ message: 'Admin user created successfully!', adminUser });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
