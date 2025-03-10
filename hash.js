import bcrypt from 'bcryptjs';

const hashPassword = async (password) => {
  //   const salt = await bcrypt.genSalt(10); // Generate salt
  const hashedPassword = await bcrypt.hash(password, 10); // Hash password
  console.log('Hashed Password:', hashedPassword);
};

hashPassword('admin123');
