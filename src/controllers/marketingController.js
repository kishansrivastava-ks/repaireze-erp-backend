import MarketingCampaign from '../models/MarketingCampaign.js';
import MarketingPlan from '../models/MarketingPlan.js';

export const addMarketingCampaign = async (req, res) => {
  try {
    const campaign = new MarketingCampaign(req.body);
    await campaign.save();
    res.status(200).json({
      messgae: 'marketing campaign created successfully !',
      campaign: campaign,
    });
  } catch (error) {
    res.status(400).json({ messgae: 'Error adding marketing campaign', error });
  }
};

export const addMarketingPlan = async (req, res) => {
  try {
    const plan = new MarketingPlan(req.body);
    await plan.save();
    res.status(200).json({
      messgae: 'marketing plan created successfully',
      plan: plan,
    });
  } catch (error) {
    res.status(400).json({
      messgae: 'Error creating marketing plan',
      error,
    });
  }
};

export const getMarketingCampaignsByType = async (req, res) => {
  try {
    const { type } = req.query;
    const campaigns = await MarketingCampaign.find({
      type,
    });
    res.status(200).json({
      results: campaigns.length,
      campaigns: campaigns,
    });
  } catch (error) {
    res.status(400).json({
      messgae: 'Error fetching marketing campaigns',
      error,
    });
  }
};

export const getMarketingPlansByType = async (req, res) => {
  try {
    const { type } = req.query;
    const plans = await MarketingPlan.find({ type });
    res.status(200).json({
      results: plans.length,
      plans: plans,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error fetching marketing plans',
      error,
    });
  }
};
