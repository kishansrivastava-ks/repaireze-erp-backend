import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    alternatePhone: { type: String },
    userType: { type: String, enum: ['admin', 'staff'], required: true },
    staffRole: {
      type: String,
      enum: ['technician', 'customer-support', 'field-agent'],
      // default: 'technician',
    },
    password: { type: String, required: true },
    pin: { type: String },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  if (this.pin) this.pin = await bcrypt.hash(this.pin, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.matchPin = async function (enteredPin) {
  return await bcrypt.compare(enteredPin, this.pin);
};

export default mongoose.model('User', userSchema);
