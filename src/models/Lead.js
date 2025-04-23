import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerMobile: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    firstCall: {
      type: String,
      enum: ['yes', 'no'],
    },
    secondCall: {
      type: String,
      enum: ['yes', 'no'],
      default: 'no',
    },
    m1: {
      type: Boolean,
      default: false,
    },
    m2: {
      type: Boolean,
      default: false,
    },
    loh: {
      type: Boolean,
      default: false,
    },
    converted: {
      type: Boolean,
      default: false,
    },
    m1Remarks: {
      type: String,
    },
    m2Remarks: {
      type: String,
    },
    lohRemarks: {
      type: String,
    },
    passedToCustomer: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Lead', leadSchema);
