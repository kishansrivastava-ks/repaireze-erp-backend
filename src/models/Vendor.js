import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    address: { type: String, required: true },
    alternateMobile: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model('Vendor', vendorSchema);
