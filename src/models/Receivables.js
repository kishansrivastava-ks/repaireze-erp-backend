import mongoose from 'mongoose';
import Customer from './Customer.js';

const receivablesSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerMobile: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      required: true,
      enum: ['online', 'cash'],
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['done', 'pending'],
    },
    invoiceNumber: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

export default mongoose.model('Receivables', receivablesSchema);
