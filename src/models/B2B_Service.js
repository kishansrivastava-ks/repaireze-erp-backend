import mongoose, { mongo } from 'mongoose';

const b2bServiceSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CustomerB2B',
      required: true,
    },
    businessName: { type: String, required: true },
    businessContact: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Please enter a valid 10-digit contact number'],
    },
    representativeName: { type: String, required: true },
    representativeContact: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Please enter a valid 10-digit contact number !'],
    },
    services: [
      {
        type: String,
        required: true,
      },
    ],
    serviceStatus: {
      type: String,
      required: true,
      enum: ['ongoing', 'scheduled', 'completed'],
    },
    date: { type: Date },
    payment: {
      isPaid: { type: Boolean, required: true },
      amount: { type: Number },
    },
  },
  { timestamps: true },
);

export default mongoose.model('B2B_Service', b2bServiceSchema);
