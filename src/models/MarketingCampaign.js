import mongoose from 'mongoose';

const MarketingCampaignSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['physical', 'digital'],
    },
    city: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    ROAS: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    managedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('MarketingCampaign', MarketingCampaignSchema);
