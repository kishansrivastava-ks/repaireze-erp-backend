import express from 'express';
import bcrypt from 'bcryptjs';
// import User from '../models/User';
import User from '../models/User.js';
import { adminOnly, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-admin', protect, adminOnly, async (req, res) => {
  try {
    const { name, phone, address, alternatePhone, password } = req.body;

    // Check if an admin already exists
    // const existingAdmin = await User.findOne({ userType: 'admin' });
    // if (existingAdmin) {
    //   return res.status(400).json({ message: 'Admin already exists!' });
    // }

    // Hash the password
    // const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Admin User
    const adminUser = await User.create({
      name,
      phone,
      address,
      alternatePhone,
      password,
      userType: 'admin', // Always admin
    });

    // await adminUser.save();

    res
      .status(201)
      .json({ message: 'Admin user created successfully!', adminUser });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
