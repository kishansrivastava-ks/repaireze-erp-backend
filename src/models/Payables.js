import mongoose from 'mongoose';
import Vendor from './Vendor.js';

const payableSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    vendorName: {
      type: String,
      required: true,
    },
    vendorMobile: {
      type: String,
    },
    serviceType: {
      type: String,
      required: true,
    },
    paymentAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['done', 'pending'],
    },
    payableStatus: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'on hold'],
      default: 'pending',
    },
    invoiceNumber: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

export default mongoose.model('Payable', payableSchema);
