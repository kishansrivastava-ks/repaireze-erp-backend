import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// export const loginUser = async (req, res) => {
//   const { phone, password } = req.body;
//   const user = await User.findOne({ phone });
//   if (user && (await user.matchPassword(password))) {
//     res.json({
//       id: user._id,
//       name: user.name,
//       phone: user.phone,
//       userType: user.userType,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(401).json({ message: 'Invalid credentials' });
//   }
// };

export const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    console.log('Login Attempt:', { phone, password });

    const user = await User.findOne({ phone });
    if (!user) {
      console.log('User not found!');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User Found:', user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password Match:', isMatch);

    if (!isMatch) {
      console.log('Incorrect Password!');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    console.log('Login Successful! Token Generated:', token);

    res.json({
      id: user._id,
      name: user.name,
      phone: user.phone,
      userType: user.userType,
      token,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyPin = async (req, res) => {
  const { phone, pin } = req.body;
  const user = await User.findOne({ phone });
  if (user && user.userType === 'staff' && (await user.matchPin(pin))) {
    res.json({
      id: user._id,
      name: user.name,
      phone: user.phone,
      userType: user.userType,
      verified: true,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid pin' });
  }
};

export const addStaff = async (req, res) => {
  const { name, phone, address, alternatePhone, staffRole, password, pin } =
    req.body;
  const userExists = await User.findOne({ phone });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const staff = await User.create({
    name,
    phone,
    address,
    alternatePhone,
    userType: 'staff',
    staffRole,
    password,
    pin,
  });
  res.status(201).json({ message: 'Staff created successfully', staff });
};
