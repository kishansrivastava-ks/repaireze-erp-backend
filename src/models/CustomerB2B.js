import mongoose from 'mongoose';

const customerB2BSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
    },
    representativeName: { type: String, required: true },
    businessContact: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Please enter a valid 10-digit contact number'],
    },
    representativeContact: {
      type: String,
      required: true,
      match: [/^\d{10}/, 'Please enter a valid 10-digit contact number'],
    },
    dateOfAddition: { type: Date, default: Date.now() },
    address: { type: String, required: true },
    siteVisitDone: { type: Boolean, required: true },
    reasonForNo: { type: String },
    servicesRequired: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model('CustomerB2B', customerB2BSchema);
