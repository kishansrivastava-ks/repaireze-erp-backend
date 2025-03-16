import User from '../models/User.js';

export const getUsers = async (req, res) => {
  try {
    res.status(200).json({ message: 'User route working!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    const staffUsers = await User.find({ userType: 'staff' }).select(
      '-password -pin',
    );
    res.status(200).json(staffUsers);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
