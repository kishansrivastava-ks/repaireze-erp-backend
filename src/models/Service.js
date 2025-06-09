import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    customerName: { type: String, required: true },
    customerMobile: { type: String, required: true },
    serviceType: { type: String, required: true },
    status: {
      type: String,
      enum: ['ongoing', 'completed', 'scheduled'],
      required: true,
    },
    scheduledDate: { type: Date },
    payment: {
      isPaid: { type: Boolean, required: true },
      amount: { type: Number },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // linking to vendor
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    vendorName: { type: String, required: true },
    vendorMobile: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('Service', serviceSchema);
