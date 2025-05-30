import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    address: { type: String, required: true },
    alternateMobile: { type: String },
    kyc_status: {
      type: String,
      enum: ['complete', 'incomplete'],
      default: 'incomplete',
    },
    qrCodeImage: { type: String, default: null }, // Store as Base64 string, optional
    aadharImage: { type: String, default: null },
    bankDetails: { type: String, default: null },
  },
  { timestamps: true },
);

export default mongoose.model('Vendor', vendorSchema);
