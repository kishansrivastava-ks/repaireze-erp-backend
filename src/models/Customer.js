import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    gstNumber: { type: String },
    dob: { type: Date },
    address: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('Customer', customerSchema);
